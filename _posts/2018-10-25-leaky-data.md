---
layout: post
title: Leaky Data
description: Why is data leakage a concern when implementing predictive models and how it can be avoided.
category: machine-learning
tags: enron pandas python statistics data-leakage
series: enron
---

So far in this series I have corrected data entry errors in the Enron dataset and
dealt with its missing and incomplete values. Before going any further there is
one more way the data can mislead us that is worth understanding: leakage.

Data leakage causes a predictive model to appear accurate on the validation data
but perform poorly when trying to use the model to make further predictions on
completely new data. It is a type of overfitting that can be difficult to track
down.

There are two main types of data leakage: Label leakage and validation leakage.

### Label Leakage

Label leakage [^1] occurs when a predictive model includes data that will not be
available at prediction time. This is a subtle form of cheating caused by
features that give a bias towards the target label. For example if trying to
predict whether an Enron employee is a person of interest we were given a
feature expressing whether they had been incarcerated, `is_incarcerated`, this
could possibly be an extremely useful indicator as to whether the Enron employee
was in fact a person of interest.

In this example an employee will be incarcerated after they are given the status
"person of interest". So the raw dataset shows a strong correlation between the
two features. But `is_incarcerated` will frequently be changed *after* the
value for `poi` is determined.

The predictive model will show that a value of `False` for `is_incarcerated`
indicates that an employee is not a person of interest. Since the validation
data comes from the same source as the testing data this pattern will continue
and the model will perform very well. However the same model will perform poorly
when used on new data not containing the `is_incarcerated` feature. It is
generally recommended that to prevent this type of data leakage, any variables
updated (or created) after the target label is realised should be excluded from
the dataset.

There is no single solution that universally solves label leakage. It requires
knowledge about your data, case-specific inspection and common sense.

However, in most cases of label leakage there exists 1 or more features having a
high statistical correlation to the target label. So two tactics to keep in
mind:

1. To screen for possible target leakage, look for columns that are
   statistically correlated to your target.
2. If you build a model and find it extremely accurate, you likely have a
   leakage problem.

We can check for correlated values in our dataset by computing a pairwise
correlation of columns, excluding NA/null values. Specifically we're interested
in features that have a high correlation to the target label, `poi`.

```python
enron_data.corr()
```

<div class="table-wrapper" markdown="block">

|                           | salary | to_messages | deferral_payments | total_payments | exercised_stock_options | bonus | restricted_stock | shared_receipt_with_poi | restricted_stock_deferred | total_stock_value | expenses | loan_advances | from_messages | other | from_this_person_to_poi | poi   | director_fees | deferred_income | long_term_incentive | from_poi_to_this_person |
| ------------------------- | ------ | ----------- | ----------------- | -------------- | ----------------------- | ----- | ---------------- | ----------------------- | ------------------------- | ----------------- | -------- | ------------- | ------------- | ----- | ----------------------- | ----- | ------------- | --------------- | ------------------- | ----------------------- |
| salary                    | 1.00   | 0.00        | 0.96              | 0.96           | 0.99                    | 0.99  | 0.99             | 0.01                    | -0.91                     | 0.99              | 0.99     | 0.74          | -0.01         | 0.96  | -0.01                   | -0.00 | 0.96          | -0.97           | 0.99                | 0.00                    |
| to_messages               | 0.00   | 1.00        | -0.00             | 0.03           | -0.01                   | 0.04  | 0.00             | 0.86                    | 0.04                      | -0.01             | -0.01    | 0.05          | 0.50          | 0.00  | 0.59                    | 0.12  | -0.05         | 0.00            | -0.00               | 0.56                    |
| deferral_payments         | 0.96   | -0.00       | 1.00              | 0.92           | 0.95                    | 0.96  | 0.95             | 0.02                    | -0.88                     | 0.95              | 0.96     | 0.69          | -0.01         | 0.95  | -0.02                   | -0.04 | 0.93          | -0.97           | 0.95                | 0.03                    |
| total_payments            | 0.96   | 0.03        | 0.92              | 1.00           | 0.96                    | 0.96  | 0.97             | 0.05                    | -0.86                     | 0.97              | 0.95     | 0.90          | -0.02         | 0.98  | -0.00                   | 0.05  | 0.91          | -0.92           | 0.96                | 0.04                    |
| exercised_stock_options   | 0.99   | -0.01       | 0.95              | 0.96           | 1.00                    | 0.98  | 0.99             | -0.00                   | -0.92                     | 1.00              | 0.98     | 0.77          | -0.03         | 0.97  | -0.02                   | 0.04  | 0.95          | -0.96           | 0.98                | -0.00                   |
| bonus                     | 0.99   | 0.04        | 0.96              | 0.96           | 0.98                    | 1.00  | 0.98             | 0.06                    | -0.90                     | 0.99              | 0.99     | 0.75          | 0.01          | 0.96  | 0.04                    | 0.02  | 0.95          | -0.97           | 0.99                | 0.06                    |
| restricted_stock          | 0.99   | 0.00        | 0.95              | 0.97           | 0.99                    | 0.98  | 1.00             | 0.00                    | -0.91                     | 0.99              | 0.98     | 0.78          | -0.02         | 0.97  | -0.01                   | 0.01  | 0.95          | -0.96           | 0.98                | -0.01                   |
| shared_receipt_with_poi   | 0.01   | 0.86        | 0.02              | 0.05           | -0.00                   | 0.06  | 0.00             | 1.00                    | 0.05                      | -0.00             | -0.00    | 0.07          | 0.26          | 0.02  | 0.50                    | 0.30  | -0.06         | -0.03           | 0.01                | 0.68                    |
| restricted_stock_deferred | -0.91  | 0.04        | -0.88             | -0.86          | -0.92                   | -0.90 | -0.91            | 0.05                    | 1.00                      | -0.91             | -0.92    | -0.65         | 0.02          | -0.87 | 0.04                    | 0.06  | -0.88         | 0.89            | -0.90               | 0.04                    |
| total_stock_value         | 0.99   | -0.01       | 0.95              | 0.97           | 1.00                    | 0.99  | 0.99             | -0.00                   | -0.91                     | 1.00              | 0.98     | 0.78          | -0.02         | 0.97  | -0.02                   | 0.03  | 0.95          | -0.96           | 0.98                | -0.00                   |
| expenses                  | 0.99   | -0.01       | 0.96              | 0.95           | 0.98                    | 0.99  | 0.98             | -0.00                   | -0.92                     | 0.98              | 1.00     | 0.72          | -0.01         | 0.95  | -0.01                   | -0.01 | 0.96          | -0.96           | 0.98                | -0.02                   |
| loan_advances             | 0.74   | 0.05        | 0.69              | 0.90           | 0.77                    | 0.75  | 0.78             | 0.07                    | -0.65                     | 0.78              | 0.72     | 1.00          | -0.03         | 0.84  | -0.03                   | 0.13  | 0.69          | -0.70           | 0.75                | 0.04                    |
| from_messages             | -0.01  | 0.50        | -0.01             | -0.02          | -0.03                   | 0.01  | -0.02            | 0.26                    | 0.02                      | -0.02             | -0.01    | -0.03         | 1.00          | -0.04 | 0.61                    | -0.04 | -0.04         | 0.02            | -0.01               | 0.22                    |
| other                     | 0.96   | 0.00        | 0.95              | 0.98           | 0.97                    | 0.96  | 0.97             | 0.02                    | -0.87                     | 0.97              | 0.95     | 0.84          | -0.04         | 1.00  | -0.04                   | 0.02  | 0.92          | -0.94           | 0.97                | 0.02                    |
| from_this_person_to_poi   | -0.01  | 0.59        | -0.02             | -0.00          | -0.02                   | 0.04  | -0.01            | 0.50                    | 0.04                      | -0.02             | -0.01    | -0.03         | 0.61          | -0.04 | 1.00                    | 0.13  | -0.04         | 0.02            | 0.00                | 0.47                    |
| poi                       | -0.00  | 0.12        | -0.04             | 0.05           | 0.04                    | 0.02  | 0.01             | 0.30                    | 0.06                      | 0.03              | -0.01    | 0.13          | -0.04         | 0.02  | 0.13                    | 1.00  | -0.06         | -0.04           | 0.01                | 0.21                    |
| director_fees             | 0.96   | -0.05       | 0.93              | 0.91           | 0.95                    | 0.95  | 0.95             | -0.06                   | -0.88                     | 0.95              | 0.96     | 0.69          | -0.04         | 0.92  | -0.04                   | -0.06 | 1.00          | -0.93           | 0.95                | -0.06                   |
| deferred_income           | -0.97  | 0.00        | -0.97             | -0.92          | -0.96                   | -0.97 | -0.96            | -0.03                   | 0.89                      | -0.96             | -0.96    | -0.70         | 0.02          | -0.94 | 0.02                    | -0.04 | -0.93         | 1.00            | -0.97               | -0.02                   |
| long_term_incentive       | 0.99   | -0.00       | 0.95              | 0.96           | 0.98                    | 0.99  | 0.98             | 0.01                    | -0.90                     | 0.98              | 0.98     | 0.75          | -0.01         | 0.97  | 0.00                    | 0.01  | 0.95          | -0.97           | 1.00                | 0.01                    |
| from_poi_to_this_person   | 0.00   | 0.56        | 0.03              | 0.04           | -0.00                   | 0.06  | -0.01            | 0.68                    | 0.04                      | -0.00             | -0.02    | 0.04          | 0.22          | 0.02  | 0.47                    | 0.21  | -0.06         | -0.02           | 0.01                | 1.00                    |

</div>

Perhaps not so surprisingly the email features that include emails to/from a poi
have a slightly more significant correlation than other features. However quite
interestingly `loan_advances` has the highest correlation of the financial
features to the target label at `0.13`. This is not high enough to be of any
concern so I'll not be removing any features from the dataset.

### Validation Leakage

A completely different type of leak occurs when you aren't careful
distinguishing training data from validation data [^2]. For example, this
happens if you run preprocessing (like fitting the Imputer for missing values)
before calling
[`sklearn.model_selection.train_test_split`](http://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html).
Validation is meant to be a measure of how the model does on data it hasn't
considered before. You can corrupt this process in subtle ways if the validation
data affects the preprocessing behaviour. The end result is that your model will
get very good validation scores, giving you great confidence, but perform poorly
when deployed to make decisions.

If your validation is based on a simple train-test split, exclude the validation
data from any type of fitting, including the fitting of preprocessing steps.
This is easier if you use
[`sklearn.pipeline.Pipeline`](http://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html).
When using cross-validation, it's even more critical that you use pipelines and
do your preprocessing before each fold (more on this in a future post).

However as mentioned in the previous post we have been forced to impute missing
values making up our email features due to the internal implementation of the
validation function provided by the Udacity course material. Perhaps in the
future I will experiment with reimplementing this function, including the
ability to accept a pipeline that may be used to impute values on each fold of
the data.

[^1]: [Leakage in Data Mining: Formulation, Detection, and Avoidance](http://doi.acm.org/10.1145/2020408.2020496)

[^2]: [Meaning and mining: the impact of implicit assumptions in data mining for the humanities](http://dx.doi.org/10.1093/llc/fqn019)
