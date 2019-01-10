---
layout: post
title: Feature Scaling
description: Investigation into fraud at Enron, continuing with feature scaling
category: machine learning
tags: data enron feature mathematics normalisation rescaling scaling standardisation statistics
---

In general, classifiers that exploit distances (i.e.
[Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance)) or
similarities between examples are sensitive to features taking on broad ranges
of values. That is classifiers that have a co-dependency between dimensions are
effected by feature scaling. For example if one feature takes on a range of
values much greater than the other features in the same dataset, the distance
will be governed by this particular feature. Therefore it is best practice to
normalise (or standardise) all features within a dataset such that each
contributes proportionately to the final distance.

Examples of classifiers sensitive to feature scaling include both Support Vector
Machines and K-Nearest Neighbour. Therefore it is imperative for this experiment
that, at least in the case of the `LinearSVC`, the features are appropriately
scaled.

Conversely graphical-model based classifiers, such as Naive Bayes, as well as
Decision trees and Tree-based ensemble methods (Random Forest, AdaBoost) are
invariant to feature scaling. However as part of the experimentation I will
scale the data for these classifiers to investigate what difference, if any, it
makes to the performance.

### Rescaling (min-max Normalisation)

[Normalisation](<https://en.wikipedia.org/wiki/Normalization_(statistics)>) is a
method commonly deployed in machine learning centred around rescaling that uses
the extreme values within a particular distribution. More specifically it looks
at the minimum and maximum values, the range of a feature, and then shrinks or
stretches each value to a common range. This common range will typically be
between`[0, 1]` or `[-1, 1]`. Selecting the target range depends on the nature
of the data. The general formula is given as:

$$
\begin{aligned}
x^{\prime} = \frac{\left(x - x_{min}\right)}{\left(x_{max} - x_{min}\right)}
\end{aligned}
$$

It is basically at what percentage of a range the value lies. Since the range is
only determined by the minimum and maximum for each feature normalisation is
invariant to extreme values. For example a series containing values
`[-100, 10, 11, 12, 900]` can still be normalised within a range of `[0, 1]`.
Here the normalised output would be `[0, 0.11, 0.111, 0.112, 1]`. What follows
is an example of applying feature normalisation to the Enron dataset and what
effect this has to the performance of each classifier.

```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
columns_to_scale = enron_data.columns.drop('poi') # poi is not a feature and should not be considered

# Make a copy of the extended dataset and perform scaling.
enron_data_normalised = enron_data.copy()
enron_data_normalised[columns_to_scale] = scaler.fit_transform(enron_data[columns_to_scale])

# Extract the data from the dataframe, with the features normalised.
my_normalised_dataset = enron_data_normalised.to_dict(orient='index')

# Create a list of classifiers to evaluate.
clfs = [
  (u'Naive Bayes', GaussianNB()),
  (u'SVM', LinearSVC(C=1000.0)),
  (u'Random Forest', RandomForestClassifier()),
  (u'AdaBoost', AdaBoostClassifier())
]

test_classifiers(clfs, my_normalised_dataset, extended_features_list)
```

```
=====> Running Naive Bayes

=====> Running SVM

=====> Running Random Forest

=====> Running AdaBoost
```

<div class="table-wrapper" markdown="block">

|               | accuracy | precision | recall | f1   | f2   |
| ------------- | -------- | --------- | ------ | ---- | ---- |
| AdaBoost      | 0.87     | 0.56      | 0.47   | 0.52 | 0.49 |
| SVM           | 0.83     | 0.42      | 0.42   | 0.42 | 0.42 |
| Random Forest | 0.88     | 0.68      | 0.28   | 0.40 | 0.32 |
| Naive Bayes   | 0.67     | 0.24      | 0.57   | 0.33 | 0.45 |

</div>

Quite unsurprisingly, normalising the features has had no (or very little)
effect on the results of the AdaBoost and RandomForest classifiers, having only
in the case of the RandomForest classifier increasd recall by 1%. This I have
deemed not significant enough to warrant any further investigation. Conversely
normalisaing the features has surprisingly had a mixed effect on the Naive Bayes
classifier, reducing the accuracy by almost 10% whilst increasing the recall by
over 20%. Since all texts online have led me to believe Naive Bayes is invariant
to feature scaling I am rather curious as to why this has had such a significant
impact.

Again unsurprisingly, as the only non graphical-model based classifer I am using
to evaluate a predictive model, the performance of the support vector machine
has improved vastly having previously been the least performant, then when
normalisation applied being far more comparible to the most performant
classifiers in the table.

### Standardisation

[Standardisation](https://en.wikipedia.org/wiki/Feature_scaling#Standardization)
is another method of feature scaling and is employed by
`sklearn.preprocessing.scale()` which assumes that all features are normally
distributed (each feature with a different mean and standard deviation), and
scales them such that each feature's Gaussian distribution is now centered
around 0, and it's standard deviation is 1 (unit-variance).

It achieves this by calculating the distribution mean and standard deviation for
each feature, and converts each value into a z-score, defined as the number of
standard deviations away from the mean:

$$
\begin{aligned}
x^{\prime} = \frac{\left(x - \bar{x}\right)}{\sigma}
\end{aligned} 
$$

In ideal circumstances where all features hold the normality assumption, in
addition to many practical situations where the normality assumption does not
hold but the distributions are somewhat close, this scheme still works pretty
well. On the other hand if the data is far from normally distributed, for
example, highly skewed, fat-tailed distributions like a
[power-law](https://en.wikipedia.org/wiki/Power_law), this scheme will not give
good results.

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
columns_to_scale = enron_data.columns.drop('poi') # poi is not a feature and should not be considered

# Make a copy of the extended dataset and perform scaling.
enron_data_standardised = enron_data.copy()
enron_data_standardised[columns_to_scale] = scaler.fit_transform(enron_data[columns_to_scale])

# Extract the data from the dataframe, with the features standardised.
my_standardised_dataset = enron_data_standardised.to_dict(orient='index')

# Create a list of classifiers to evaluate.
clfs = [
  (u'Naive Bayes', GaussianNB()),
  (u'SVM', LinearSVC(C=1000.0)),
  (u'Random Forest', RandomForestClassifier()),
  (u'AdaBoost', AdaBoostClassifier())
]

test_classifiers(clfs, my_standardised_dataset, extended_features_list)
```

```
=====> Running Naive Bayes

=====> Running SVM

=====> Running Random Forest

=====> Running AdaBoost
```

<div class="table-wrapper" markdown="block">

|               | accuracy | precision | recall | f1   | f2   |
| ------------- | -------- | --------- | ------ | ---- | ---- |
| AdaBoost      | 0.87     | 0.56      | 0.48   | 0.52 | 0.49 |
| SVM           | 0.84     | 0.44      | 0.56   | 0.49 | 0.53 |
| Random Forest | 0.88     | 0.67      | 0.28   | 0.40 | 0.32 |
| Naive Bayes   | 0.63     | 0.23      | 0.68   | 0.35 | 0.49 |

</div>

The results above show a similar trend to those obtained from normalising the
data, with no discernible difference in performance from both the AdaBoost and
RandomForest classifiers and a large improvement from the support vector
machine. It is important to note however that standardising the data has
somewhat further improved the performance of the support vector machine over
normalisation, boosting the F1 score to almost that of the most performant
classifier.

As before, and just as surprisingly the Naive Bayes classifier has returned a
decrease in accuracy but overall improvement in recall and therefore F2 score.
At a later date I would like to dive into why scaling the data is causing this
behaviour from this particular classifier.

### Considerations...

Rescaling
([MinMaxScaler](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html#sklearn.preprocessing.MinMaxScaler))
works much better in certain cases where standardisation
([StandardScaler](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html))
might not work well. For example, if the standard deviations are very small for
features, standardisation is highly sensitive to tiny changes between standard
deviations of different features, but rescaling is very robust. Also, for
features with highly skewed distributions, or sparse cases where each feature
has a lot of zeros that move the distribution away from a Gaussian, rescaling is
a better choice.

```python
enron_data.drop(columns=['poi']).std().to_frame('# standard deviations')
```

<div class="table-wrapper" markdown="block">

|                                  | # standard deviations |
| -------------------------------- | --------------------- |
| salary                           | 197600.56             |
| to_messages                      | 2043.02               |
| deferral_payments                | 766161.13             |
| total_payments                   | 8901866.63            |
| exercised_stock_options          | 4995771.18            |
| bonus                            | 1082916.14            |
| restricted_stock                 | 2030256.98            |
| shared_receipt_with_poi          | 937.60                |
| restricted_stock_deferred        | 277901.51             |
| total_stock_value                | 6361214.05            |
| expenses                         | 46381.80              |
| loan_advances                    | 6915543.11            |
| from_messages                    | 1459.43               |
| other                            | 1150429.36            |
| from_this_person_to_poi          | 73.39                 |
| director_fees                    | 29479.77              |
| deferred_income                  | 615568.91             |
| long_term_incentive              | 682003.43             |
| from_poi_to_this_person          | 57.80                 |
| fraction_salary                  | 0.20                  |
| fraction_bonus                   | 0.59                  |
| fraction_long_term_incentive     | 0.56                  |
| fraction_exercised_stock_options | 0.39                  |
| fraction_from_poi_to_this_person | 0.03                  |
| fraction_from_this_person_to_poi | 0.17                  |

</div>

Despite there being a small handful of features with tiny standard deviations,
all resulting from features engineered in the previous section, it is conclusive
from the test results that standardisation has seen the largest improvements in
the non graphical-model based classifiers (in this case only SVM). Moreover
since standardisation also has no significant effect on both the AdaBoost and
RandomForest classifiers it should not harm to apply the same scaling operation
when further testing these classifiers in later sections, thus making
experimentation much easier and fair.

However due to the surprising results from the Naive Bayes classifier it may be
time to eliminate it from the list of potential candidates for final selection.
Despite in both cases (normalisation and standardisation) Naive Bayes performed
slightly better, according to the evaluation metrics I'm optimising for, I feel
this may be coincidental and this particular classifier too unpredictable to
continue evaluating.
