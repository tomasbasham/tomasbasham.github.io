---
layout: post
title: Structuring Terraform Ownership in Layers
description: Why a flat Terraform workspace maximises blast radius, and how a four-tier ownership model bounds it instead.
category: infrastructure
tags: terraform infrastructure-as-code ownership security
---

Infrastructure teams tend to discover the same problem at different points in
their growth. Someone adds a resource to the wrong workspace, a plan runs
against the wrong state file, and suddenly you are staring at a proposed
deletion of something critical. The instinct is to consolidate — one workspace,
one state file, one place where everything lives. That instinct is wrong.

The right model comes from asking a different question entirely: who should be
allowed to change this?

### Infrastructure is not flat

Cloud infrastructure has a natural hierarchy. Some resources are foundational —
the identity pools, the folder structure, the organisation policies that govern
what is even possible within your environment. Others are shared services: a
Kubernetes cluster, a database, a message queue that multiple teams depend
upon. Others still are workload-specific, tightly coupled to a single
application and owned entirely by the team that builds it.

Treating all of these as equivalent, managed from the same workspace with the
same credentials, collapses a meaningful distinction. It also maximises blast
radius. When a workspace can touch everything, a mistake anywhere can affect
everything.

The layered model addresses this by decomposing Terraform configuration into
four tiers, each with its own workspace, its own service account, and its own
permission boundary.

### The four tiers

**Organisation** is the root. It owns the trust infrastructure that all
subsequent automation depends upon: the Workload Identity Pools that allow CI/CD
pipelines to authenticate without long-lived keys, the folder hierarchy that
structures the environment, and the organisation-wide policies that define what
is permissible across every project beneath them. Custom IAM roles that other
layers will later reference are also defined here.

What the Organisation workspace does not own is general service account
management. It establishes the rules of the game. Everything else belongs to a
layer above it.

**Governance** owns the containers. In GCP, a project is a hard isolation
boundary — a separate IAM namespace, a separate quota domain, a separate unit of
billing. Creating a project is an administrative act that precedes everything
else, and it lives in the Governance workspace. This layer also creates the
service accounts and IAM principals that Platform and Delivery teams will later
assume when provisioning resources or running workloads.

The separation of project administration from project tenancy is one of the more
important principles in this model. The team deploying an application should not
also hold the ability to modify the IAM bindings that govern access to the
project it runs in.

In AWS, the equivalent isolation boundary is an account rather than a
project. The Governance workspace would own account vending through AWS
Organizations and the IAM roles that downstream workloads assume via
cross-account trust. The concept is identical; only the resource types differ.

**Platform** owns shared services. Kubernetes clusters, networking, DNS zones,
shared image repositories — the infrastructure that Delivery teams depend upon
but should not be able to modify directly. Changes here require platform team
involvement. Application teams are consumers, not owners.

**Delivery** is where software reaches customers. Application services,
deployment configuration, workload-specific storage — these live in Delivery
workspaces, owned and operated by the teams that build the products. They
operate with autonomy within their layer because the layers below have already
established the boundaries within which that autonomy is safe.

### Data sources as contracts

Shared Terraform state is a coupling mechanism. A workspace that can read
another workspace's state file can read everything in it, and often ends up
depending on implementation details that were never intended as a public
interface.

The better pattern is the `data` source. Rather than sharing state, a lower
layer promises to maintain a resource with a known name. An upper layer looks
that resource up.

```hcl
# Delivery workspace — references a DNS zone it does not own
data "google_dns_managed_zone" "private" {
  name = "services-private"
}

resource "google_dns_record_set" "app" {
  name         = "my-service.${data.google_dns_managed_zone.private.dns_name}"
  managed_zone = data.google_dns_managed_zone.private.name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_address.app.address]
}
```

The Delivery workspace's service account holds
`roles/dns.resourceRecordSetsOwner` — enough to manage records within the zone,
but not to create, delete, or reconfigure it. The `data` source lookup requires
only `roles/dns.reader`. The zone is the Platform team's contract to maintain;
the records within it are the Delivery team's concern.

The same applies to service accounts. A Delivery workspace that needs to assign
an identity to a workload does not create that identity — it looks it up.

```hcl
# Delivery workspace — uses an identity it does not manage
data "google_service_account" "app" {
  account_id = "my-application"
}

resource "google_cloud_run_v2_service" "app" {
  name     = "my-application"
  location = "europe-west2"

  template {
    service_account = data.google_service_account.app.email
  }
}
```

The service account was provisioned in the Governance workspace. The Delivery
workspace can reference it and assign it to a workload. It cannot modify the
account's permissions or create accounts alongside it.

### IAM follows the same shape

The layered model maps directly onto the roles held by each workspace's service
account.

| Workspace | Owns | Example roles |
|---|---|---|
| Organisation | WIPs, folder structure, org policies, custom roles | `roles/iam.organizationRoleAdmin`, `roles/orgpolicy.policyAdmin` |
| Governance | Projects, billing, service accounts, IAM principals | `roles/resourcemanager.projectCreator`, `roles/iam.serviceAccountAdmin` |
| Platform | Kubernetes clusters, DNS zones, shared networking | `roles/container.admin`, `roles/dns.admin`, `roles/compute.networkAdmin` |
| Delivery | Application services, workload-specific records and buckets | `roles/run.admin`, `roles/dns.resourceRecordSetsOwner` |

Within any given layer, per-concern service accounts are preferable to
team-level shared accounts. A single `platform-sa` with broad permissions
creates invisible contention — in GCP, quota attribution operates per service
account, and a shared account makes that attribution opaque. Scoped accounts
like `artifact-registry-administrator-sa` also limit the damage if a credential
is compromised.

### Keyless authentication completes the picture

Scoped service accounts are the right unit of identity, but long-lived keys
undermine the model regardless of how carefully you scope them. A static key
grants persistent access. The natural complement to layered workspaces is
Workload Identity Federation — short-lived OIDC credentials that a CI/CD
pipeline assumes for the duration of a job and cannot hold beyond it.

In GCP, a dedicated identity project managed by the Organisation workspace hosts
Workload Identity Pools for Terraform Cloud and GitHub Actions alike.

```hcl
# Organisation workspace — establishes the federation trust
resource "google_iam_workload_identity_pool" "tfc" {
  workload_identity_pool_id = "terraform-cloud"
}

resource "google_iam_workload_identity_pool_provider" "tfc" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.tfc.workload_identity_pool_id
  workload_identity_pool_provider_id = "tfc-provider"

  oidc {
    issuer_uri = "https://app.terraform.io"
  }

  attribute_mapping = {
    "google.subject"                   = "assertion.sub"
    "attribute.terraform_workspace_id" = "assertion.terraform_workspace_id"
  }
}
```

Workspace-specific attribute conditions on IAM bindings ensure that each
Terraform Cloud workspace can only assume its designated service account. The
Delivery workspace cannot escalate to Governance credentials. The trust boundary
is enforced at the identity layer, not by convention.

One nuance: for elevated workspaces — Organisation and Governance — retaining
service account impersonation rather than direct WIF principal binding preserves
`iam.serviceAccounts.actAs` as an explicit control point and produces cleaner
audit trails. For lower-privilege workspaces, direct binding is simpler. A
hybrid approach is sensible; the choice of where to draw that line is a function
of your audit requirements.

### Blast radius is the real metric

The value of this model is not architectural elegance. It is bounded failure.

When something goes wrong in a Delivery workspace, the damage is contained to
that workspace's resources. A misconfigured `count` expression cannot delete a
VPC. A `terraform destroy` run against the wrong directory cannot revoke the IAM
bindings the entire platform depends upon. The blast radius of a change is
determined by what the executing credential can touch — not by what you intended
to change.

This is why the boundaries matter across repositories too, not just within
Terraform workspaces. A workspace that combines Kubernetes configuration with
general configuration management has a larger blast radius than two workspaces
that each do one thing. The discipline of separation is not overhead. It is the
mechanism by which a mistake stays local.

### This scales down as well as up

It is easy to read a four-tier model and conclude it only makes sense with a
dedicated platform team and significant organisational complexity. That
conclusion is wrong.

A team of two engineers benefits from the separation. When you are working on a
delivery task, the confidence that `terraform apply` cannot inadvertently
destroy shared infrastructure is not a luxury — it is what lets you move at
speed without anxiety. The layers are not bureaucracy. They are the thing that
makes autonomy safe.

The practical starting point for a small team is two workspaces: one combining
Organisation and Governance concerns with elevated permissions, and one
combining Platform and Delivery resources that reference the foundation via
`data` sources. The four-tier model is the natural destination as the
infrastructure and team grow. It does not need to be the starting point.

### Least privilege, applied to tooling

The layered model is the principle of least privilege applied to infrastructure
tooling rather than to IAM policy alone. Every workspace holds exactly the
access it needs to do its job.

A misconfigured plan in a workspace with too-broad permissions can cause damage
that takes hours to unpick. The same misconfiguration in a tightly-scoped
workspace fails immediately, with a permissions error that tells you exactly
what went wrong.

Noisy, local failures are the goal.
