---
layout: post
title: 'Hyperparameter Tuning: Optimising Classifier Performance'
description: Investigation into fraud at Enron, concluding with hyperparameter tuning.
category: machine-learning
tags: enron statistics hyperparameter-tuning
series: enron
---

This closes out the investigation. The previous section left two threads
unresolved: how many of the engineered features are actually worth keeping, and
whether the classifiers can be pushed further than their default parameters. Both
questions turn out to be the same question, since the optimal number of features
depends on the classifier doing the selecting, and the optimal classifier
parameters depend on which features it's given. They need to be tuned together,
not in sequence.

I'm going to carry forward the two strongest performers from the previous
sections, Random Forest and AdaBoost, and discard Naive Bayes and SVM. Both were
comfortably outperformed and neither exposes parameters worth the tuning effort
here.

### Choosing the Number of Features

`RFECV` wraps recursive feature elimination with cross-validation, scoring each
candidate feature count against a chosen metric and settling on whichever count
performs best. I'm optimising for F1, consistent with every other decision made
in this project so far.

```python
from sklearn.feature_selection import RFECV
from sklearn.model_selection import StratifiedShuffleSplit

cv = StratifiedShuffleSplit(n_splits=100, random_state=42)

random_forest_rfecv = RFECV(
  estimator=RandomForestClassifier(),
  step=1,
  cv=cv,
  scoring='f1',
)
random_forest_rfecv.fit(features, labels)
random_forest_rfecv.n_features_
```

```
7
```

```python
adaboost_rfecv = RFECV(
  estimator=AdaBoostClassifier(),
  step=1,
  cv=cv,
  scoring='f1',
)
adaboost_rfecv.fit(features, labels)
adaboost_rfecv.n_features_
```

```
11
```

Neither classifier wants anywhere near the full `extended_features_list`. Random
Forest settles on 7 features, AdaBoost on 11, and the two selections overlap only
partially — which is consistent with the disagreement in feature importances
observed previously. This is a reasonable result: each classifier draws its
decision boundary differently, so there's no reason to expect them to agree on
which features matter most, only that each has found the set that matters most
to it.

```python
random_forest_features = [f for f, kept in zip(extended_features_list[1:], random_forest_rfecv.support_) if kept]
adaboost_features = [f for f, kept in zip(extended_features_list[1:], adaboost_rfecv.support_) if kept]
```

### Tuning the Classifiers

With a feature count fixed for each classifier, `GridSearchCV` can search the
hyperparameter space properly. I'm scoring on F1 again, for the same reason as
above, and using the same cross-validation strategy throughout this project.

```python
from sklearn.model_selection import GridSearchCV

random_forest_params = {
  'n_estimators': [10, 25, 50, 100],
  'criterion': ['gini', 'entropy'],
  'max_depth': [None, 5, 10, 20],
  'min_samples_split': [2, 4, 8],
}

random_forest_grid = GridSearchCV(
  RandomForestClassifier(),
  random_forest_params,
  scoring='f1',
  cv=cv,
)
random_forest_grid.fit(features[:, random_forest_rfecv.support_], labels)
random_forest_grid.best_params_
```

```
{'criterion': 'entropy', 'max_depth': 10, 'min_samples_split': 4, 'n_estimators': 50}
```

```python
adaboost_params = {
  'n_estimators': [25, 50, 100, 200],
  'learning_rate': [0.1, 0.5, 1.0, 1.5],
}

adaboost_grid = GridSearchCV(
  AdaBoostClassifier(),
  adaboost_params,
  scoring='f1',
  cv=cv,
)
adaboost_grid.fit(features[:, adaboost_rfecv.support_], labels)
adaboost_grid.best_params_
```

```
{'learning_rate': 0.5, 'n_estimators': 100}
```

Nothing here is surprising on reflection. Entropy edging out gini by a small
margin is in line with the earlier note that the two criteria rarely differ by
much. The lower learning rate paired with more estimators for AdaBoost is the
usual trade: smaller steps, more of them, slightly better generalisation.

### Results

Running both tuned classifiers back through `test_classifier` with their
selected feature subsets gives the final comparison for this project.

```python
tuned_random_forest = RandomForestClassifier(**random_forest_grid.best_params_)
results.loc['Random Forest (tuned)'] = test_classifier(
  tuned_random_forest, my_standardised_dataset, ['poi'] + random_forest_features
)

tuned_adaboost = AdaBoostClassifier(**adaboost_grid.best_params_)
results.loc['AdaBoost (tuned)'] = test_classifier(
  tuned_adaboost, my_standardised_dataset, ['poi'] + adaboost_features
)
```

```
RandomForestClassifier(criterion='entropy', max_depth=10, min_samples_split=4,
            n_estimators=50)
 Accuracy: 0.88329 Precision: 0.64294 Recall: 0.41400 F1: 0.50362 F2: 0.44588
 Total predictions: 14000 True positives:  828 False positives:  460 False negatives: 1172 True negatives: 11540

AdaBoostClassifier(learning_rate=0.5, n_estimators=100)
 Accuracy: 0.87593 Precision: 0.56809 Recall: 0.50750 F1: 0.53610 F2: 0.51846
 Total predictions: 14000 True positives: 1015 False positives:  771 False negatives:  985 True negatives: 11229
```

<div class="table-wrapper" markdown="block">

|                        | accuracy | precision | recall | f1   | f2   |
| ---------------------- | -------- | --------- | ------ | ---- | ---- |
| AdaBoost (tuned)       | 0.88     | 0.57      | 0.51   | 0.54 | 0.52 |
| Random Forest (tuned)  | 0.88     | 0.64      | 0.41   | 0.50 | 0.45 |
| AdaBoost (default)     | 0.87     | 0.56      | 0.48   | 0.52 | 0.49 |
| Random Forest (default)| 0.88     | 0.69      | 0.31   | 0.42 | 0.34 |

</div>

Tuning moved both classifiers in the direction that actually mattered for this
problem. Random Forest's recall improved by ten points at a reasonable cost to
precision; AdaBoost's recall improved further still and remains the better
all-round classifier on F1. Neither tuning pass was dramatic, which is itself a
useful result: it says the earlier feature engineering and scaling work was
doing most of the heavy lifting, and hyperparameter tuning was only ever going to
be a final few points of polish, not a substitute for it.

AdaBoost, tuned, with 11 features selected by `RFECV`, is the model I would take
forward: accuracy 0.88, precision 0.57, recall 0.51, comfortably clearing the
0.3 threshold set at the start of this project on both of the metrics that
actually matter for identifying a person of interest.

### Closing Note

This is the last post in this series. Looking back, the most valuable lessons
weren't the individual techniques — cleaning, imputation, scaling, feature
engineering, selection, tuning — but how much each one depended on the ones
before it. A classifier tuned against unscaled features would have told me
nothing useful. A feature selected without cross-validation would have told me
nothing I could trust. None of these steps work in isolation, and treating them
as a checklist rather than a pipeline is, I suspect, the most common way this
kind of project goes wrong.
