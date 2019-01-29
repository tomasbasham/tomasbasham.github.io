---
layout: post
title: Selecting the Right Features
description: Investigation into fraud at Enron, continuing with feature selection
category: machine learning
tags: data enron feature importance mathematics recursive selection statistics univariate
---

The features in our dataset have a significant influence over the performance of
the predictive model we are able to create. Broadly speaking, in machine
learning if you feed garbage into a classifier you should expect only garbage to
come out. This becomes more important as the number of features in the dataset
grows. You need not use every available feature when creating a model, therefore
it is important to discover which features are contributing most to predicting
the output variable. In our case this is the likelihood an Enron employee is in
fact a person of interest. This is a very difficult problem which often requires
a deep understanding of the domain. However it is possible to automatically
identify a subset of features from the original dataset that are the most
relevant and useful through a process called feature selection. It is this
process that may mean the difference between successfully and meaningfully
modelling the problem and not.

Throughout previous sections it has been accepted that the more data we have the
better our trained model will be at making predictions. This is generally the
case but does have a few caveats. For instance, including redundant or partially
redundant features can be misleading to modelling algorithms. This is especially
true of linear algorithms such as linear and logistic regression. Furthermore
irrelevant attributes may contribute to overfitting. Some Decision Tree
algorithms, including the Random Forest classifier used in this experiment,
attempt to make splits in feature values. Less relevant features will be split
on last but may contribute to small amounts of noise, only benefiting the model
by chance. Overall this could have a large negative impact on model performance
and accuracy.

We can therefore conclude that the removal of redundant features may benefit the
performance of a predictive model, lowering the prediction error that would be
otherwise incurred if using the full dataset. Overall choosing to keep only the
most relevant features has the following desired effects:

- **Reduces Overfitting**: Less redundant data means less opportunity to make
  decisions based on noise.
- **Improves Accuracy**: Less misleading data means modelling accuracy improves.
- **Reduces Training Time**: Less data means that algorithms train faster.

### Approach with Caution

Whilst feature selection is a vital part of the machine learning process we must
be aware of the cost of performing it too early. In reality the choice of
features may have an impact on the optimal hyperparameter values of our
predictive model, and those values may also impact the choice of optimal
features. Therefore we end up in a chicken and egg situation which could be
solved by considering feature selection as part of the model selection process.
If not bias may be introduced into our model and result in overfitting.

In addition it would be a mistake to first perform feature selection on the
entire dataset, then perform model selection, training and validation on the
selected features. The reason for this is that the validation and testing
datasets will have also been been used when deciding on the selection of
features thus introducing bias in the predictive model.

To avoid this situation feature selection must be performed as part of the
iterative validation process when using such techniques as cross-validation.
This means that feature selection is performed on the prepared fold right before
the model is trained. More generally feature selection must be performed on a
different dataset than that which is used for validation and testing. Moreover
feature selection must not be performed on the test set, as this will inflate
estimates of the models' performance.

### Feature Importance

Bagged Decision Trees like Random Forest and AdaBoost can be used to estimate
and rank the importance of features in both regression and classification
problems. We can take advantage of this to get a sense of which features may be
most important and perform an amount of manual feature selection. The benefit to
this approach is that each classifier can be given its own crafted subset of
features. However one drawback is that this technique can only be applied to
those classifiers that support it. Therefore the Linear Support Vector Machine
cannot take advantage of this method. However it is still useful nonetheless.

To get a little more context a Bagged Decision Tree is a classifier that fits
many Decision Trees on a random subset of the original dataset and then takes
the mean of all their individual predictions, forming a final prediction. Due to
this each Decision Tree has its own feature importances, which are also averaged
to create a final set of importances.

$$
\begin{aligned}
f(x) = \frac{\sum_{i}importances(x_i)}{\mid x \mid}
\end{aligned}
$$

When the importances are returned from these classifiers they are no longer
clearly identifiable by name. Instead only the score is returned. Therefore to
see what these look like I will first define a function to print out the feature
importances alongside their original names. Luckily the scores are in the same
order as the features were given to the classifier.

```python
# Justify the output of feature importances.
print_importance = lambda f, importance: print('{}:'.format(f).ljust(34), importance)

def print_feature_importances(clf, features_list):
  feature_name_and_importance = zip(features_list, clf.feature_importances_)
  for feat, importance in sorted(feature_name_and_importance, key=lambda x: x[1], reverse=True):
    print_importance(feat, importance)
```

Now retrieving the feature importances is as simple as accessing the
`feature_importances_` attribute on the trained predictive model as seen below
with the RandomForestClassifier.

```python
random_forest_selection = RandomForestClassifier()
test_classifier(random_forest_selection, my_standardised_dataset, extended_features_list)

# Print the feature names and importances.
print_feature_importances(random_forest_selection, extended_features_list[1:])
```

```
RandomForestClassifier(bootstrap=True, class_weight=None, criterion='gini',
            max_depth=None, max_features='auto', max_leaf_nodes=None,
            min_impurity_decrease=0.0, min_impurity_split=None,
            min_samples_leaf=1, min_samples_split=2,
            min_weight_fraction_leaf=0.0, n_estimators=10, n_jobs=1,
            oob_score=False, random_state=None, verbose=0,
            warm_start=False)
 Accuracy: 0.88079 Precision: 0.68616 Recall: 0.30500 F1: 0.42229 F2: 0.34312
 Total predictions: 14000 True positives:  610 False positives:  279 False negatives: 1390 True negatives: 11721

fraction_from_this_person_to_poi:  0.15772587126321302
from_this_person_to_poi:           0.07913644969485686
from_poi_to_this_person:           0.07450123046262125
shared_receipt_with_poi:           0.06905464725199587
to_messages:                       0.06828217700335208
exercised_stock_options:           0.06664019639994397
fraction_from_poi_to_this_person:  0.05883132898850809
fraction_bonus:                    0.05797301315774215
bonus:                             0.048260618890688695
other:                             0.04588831736619155
deferred_income:                   0.04530660406692018
fraction_salary:                   0.04512693785651663
restricted_stock:                  0.03869837751214115
total_payments:                    0.02862056071515532
from_messages:                     0.022699320372877748
salary:                            0.019975283401916417
fraction_exercised_stock_options:  0.016776764181608478
total_stock_value:                 0.01650332532685474
fraction_long_term_incentive:      0.015636726191611848
long_term_incentive:               0.013637239170273239
expenses:                          0.010725010725010725
deferral_payments:                 0.0
restricted_stock_deferred:         0.0
loan_advances:                     0.0
director_fees:                     0.0
```

It can be seen from the output that the attribute `feature_importances_` holds a
score for each of the features in the dataset representing the estimated
importance of each feature. The importances are ordered such that those with the
largest value are considered the most relevant to the classifier whilst those
towards the bottom are considered of lower relevance and could contribute noise
to the predictive model.

We can similarly retrieve the feature importances from the AdaBoostClassifier.

```python
adaboost_selection = AdaBoostClassifier()
test_classifier(adaboost_selection, my_standardised_dataset, extended_features_list)

# Print the feature names and importances.
print_feature_importances(adaboost_selection, extended_features_list[1:])
```

```
AdaBoostClassifier(algorithm='SAMME.R', base_estimator=None,
          learning_rate=1.0, n_estimators=50, random_state=None)
 Accuracy: 0.87271 Precision: 0.56450 Recall: 0.47700 F1: 0.51707 F2: 0.49226
 Total predictions: 14000 True positives:  954 False positives:  736 False negatives: 1046 True negatives: 11264

from_this_person_to_poi:           0.14
shared_receipt_with_poi:           0.1
fraction_from_poi_to_this_person:  0.1
fraction_from_this_person_to_poi:  0.1
expenses:                          0.08
fraction_salary:                   0.08
other:                             0.06
fraction_long_term_incentive:      0.06
deferral_payments:                 0.04
bonus:                             0.04
total_stock_value:                 0.04
salary:                            0.02
to_messages:                       0.02
total_payments:                    0.02
exercised_stock_options:           0.02
deferred_income:                   0.02
long_term_incentive:               0.02
from_poi_to_this_person:           0.02
fraction_bonus:                    0.02
restricted_stock:                  0.0
restricted_stock_deferred:         0.0
loan_advances:                     0.0
from_messages:                     0.0
director_fees:                     0.0
fraction_exercised_stock_options:  0.0
```

It is rather interesting to compare the feature importances of both the
RandomForestClassifer and the AdaBoostClassifier. It is clear from the results
that both classifiers do not agree on the 10 most important features despite
each classifier having arguably equal accuracy thus far. This could be noted
further indication that accuracy is not a great metric in this experiment.
However what is clear is that both classifiers regard several of the engineered
features more important than many of the original features in dataset. This
would suggest that these features in fact describe a trend in the data posing a
strong correlation to the output variable.

There would be little point to investigate further whether only using the top
`n` features has any impact on the performance of the predictive model since
there is likely a co-dependency on the classifier hyperparameters which will be
investigates in a later section. For now it is enough to know how wildly
different the importances are for each classifier with their respective default
options.

### Univariate Feature Selection

Univariate feature selection works by selecting the most relevant features as
reported by some univariate statistical function. That is when univariate
feature selection is applied each feature is assigned a score indicating the
strength of its relationship with the output variable. One of the most valuable
properties of univariate feature selection is that it is independent of any one
implementation of classifier, unlike feature importances which only work with a
select few modelling implementations.

We can use
[`sklearn.feature_selection.SelectKBest`](http://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.SelectKBest.html#sklearn.feature_selection.SelectKBest)
which by default applies the
[`f_classif`](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.f_classif.html#sklearn.feature_selection.f_classif)
scoring function to compute the ANOVA F-value for the provided samples. This is
a good scoring function for the Enron dataset which contains a few negative
values. Beside the scoring function the only other parameter to tune here is the
number of features we wish to keep (default 10).

Alternatively if we had previously normalised the features between 0 and 1 then
we could use the
[`chi2`](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.chi2.html#sklearn.feature_selection.chi2)
scoring function to compute the chi-squared statistics between each non-negative
feature and class.

As before I will first define a function to print out the returned scores
alongside the original name of the feature. This function only differs by name
and the attribute used to access the scores (`scores_`). However for the sake of
clarity I see no reason to be
[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

```python
# Justify the output of feature scores.
print_score = lambda f, score: print('{}:'.format(f).ljust(34), score)

def print_feature_scores(clf, features_list):
  feature_name_and_score = zip(features_list, clf.scores_)
  for feat, score in sorted(feature_name_and_score, key=lambda x: x[1], reverse=True):
    print_score(feat, score)
```

We can then compute the scores by first separating the features from the labels
using methods provided by the course material and running these through the
`SelectKBest` algorithm. Note that I have set the algorithm to reduce the
dataset down to the 4 most relevant features. This however will not become
important until the dataset has been transformed.

```python
from sklearn.feature_selection import SelectKBest
from feature_format import featureFormat, targetFeatureSplit

data = featureFormat(my_standardised_dataset, extended_features_list, sort_keys = True)
labels, features = targetFeatureSplit(data)

select_k_best = SelectKBest(k=4).fit(features, labels)

# Print the feature names and scores.
print_feature_scores(select_k_best, extended_features_list[1:])
```

```
bonus:                             30.996650263046035
fraction_from_this_person_to_poi:  24.74703911283773
total_stock_value:                 21.715370553236223
exercised_stock_options:           21.61831247068783
fraction_bonus:                    20.11247267477801
salary:                            17.652821354040245
shared_receipt_with_poi:           15.901048190153714
fraction_long_term_incentive:      13.280784474046534
from_poi_to_this_person:           11.868915005764967
deferred_income:                   10.877747814724641
long_term_incentive:               10.438729740129324
total_payments:                    9.17891146854367
restricted_stock:                  8.383512828688367
loan_advances:                     6.949372528479059
expenses:                          5.038223197623868
other:                             3.968449361834746
from_this_person_to_poi:           3.5603092511206285
fraction_salary:                   2.363441883884539
to_messages:                       2.259290587732519
fraction_from_poi_to_this_person:  2.1529983056261957
director_fees:                     2.030244576563368
restricted_stock_deferred:         0.7943522196252019
deferral_payments:                 0.26155708920673937
from_messages:                     0.16456684445456812
fraction_exercised_stock_options:  0.05302510191815604
```

Here we can see the scores that have been assigned to each feature, where the
largest scores indicate the most relevant features. When the dataset is
transformed through this algorithm it will return only the 4 most relevant
features since the `k` variable was set to 4. This can been seen below.

```python
transformed_data = select_k_best.transform(features)
transformed_data.shape
```

```
(139, 4)
```

These 4 features, in order of relevance, are:

1. `bonus`
2. `fraction_from_this_person_to_poi`
3. `total_stock_value`
4. `exercised_stock_options`

Interestingly the second most relevant feature to be returned by `SelectKBest`
is an engineered feature describing the messages sent to a person of interest as
a fraction of total messages they have sent. Perhaps not so surprisingly however
are the other most relevant features which I intuitively believe to be some of
the more important drivers indicating a person of interest.

Again it must be noted that the features here do not agree with the feature
importances returned from the Random Forest and AdaBoost classifiers.

Given that using this algorithm we can select only a subset of features that are
most relevant the problem is reduced to that of optimising how many features
should be selected to obtain the most performant predictive model. Choosing thss
value will be the focus of the hyperparameter tuning section of this experiment.

### Recursive Feature Elimination

Recursive feature elimination works by identifying which attributes (and
combination of attributes) contribute the most to predicting the target value.
This is achieved by first training the predictive model on the initial set of
feature and then removing the least relevant feature, indicated by the smallest
feature coefficient or feature importance. The model is then retrained and the
next least relevant feature removed. This process continues by considering
smaller and smaller sets of features until we arrive at the desired number of
remaining features.

We can use
[`sklearn.feature_selection.RFE`](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.RFE.html)
to perform this task, that given a classifier capable of assigning
weights/scores to each feature, will determine the least relevant feature
through either the `coef_` or `feature_importances` attribute. We have observed
that the classifiers used in this experiment process either attribute and can
therefore all be used to perform recursive feature elimination.

It is important to note that features must first be scaled, otherwise there is a
chance that features with smaller values will have a minimal coefficient and
therefore be dropped. However if the features are scaled with a preprocessing
stage these same feature could turn out to be quite important. Fortunately we
have already covered this in the previous section where we are standardising the
data using the `StandardScaler`.

Unlike univariate feature selection

As with univariate feature selection the problem of selecting features is
reduced to the of optimising how many features should be selected to obtain the
most performant model. For this I would like to
[`sklearn.feature_selection.RFECV`](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.RFECV.html#sklearn.feature_selection.RFECV)
which extend `RFE` with a cross-validation step with the intent to seek out the
optimal number of features given for a given metric. In this case I will
optimise for the F1 score.
