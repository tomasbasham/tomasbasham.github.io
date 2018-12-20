---
layout: post
title: Classifier Pre-Assessment
description: Investigation into fraud at Enron, continuing with classifier assessment.
category: machine learning
tags: adaboost classifier data decision-tree enron mathematics naive-bayes random-forest statistics support-vector-machines
---

In this section I am going to perform a preliminary assessment of 4 "out of the
box" classifiers using their respective default parameters. I'm going to use the
results of evaluating these classifiers as a baseline from which I may improve
performance, or ultimately dismiss classifiers from being further evaluated.

I am going to begin using all of the features in the dataset because presently
there are no strong indicators as to which features are driving the patterns in
the data.

```python
# `features_list` is a list of strings, each of which is a feature name in the dataset.
# The first feature in the list must be `poi` — the target label.
features_list = [
  'poi',
  'salary',
  'to_messages',
  'deferral_payments',
  'total_payments',
  'exercised_stock_options',
  'bonus',
  'restricted_stock',
  'shared_receipt_with_poi',
  'restricted_stock_deferred',
  'total_stock_value',
  'expenses',
  'loan_advances',
  'from_messages',
  'other',
  'from_this_person_to_poi',
  'director_fees',
  'deferred_income',
  'long_term_incentive',
  'from_poi_to_this_person'
]
```

Next I have to extract a dictionary from the dataframe we've been using
throughout the fist half of this investigation. Importantly the data is
reorientated such that the keys in the dictionary are the Enron employees
instead of the features, which is the default.

```python
my_dataset = enron_data.to_dict(orient='index')
```

Despite having implemented a method to test each classifier sequentially, in
this section I will perform the evaluation each time using `test_classifier` to
show the general approach that will be taken throughout the remainder of the
project. This also lends to writing up a little about each classifier and
detailing their features.

To record the results of the pre-assessment I will create a dataframe where the
columns match the evaluation metrics discussed in the last section.

```python
results = pd.DataFrame(columns=['accuracy', 'precision', 'recall', 'f1', 'f2'])
```

### Naive Bayes

A Naive Bayes classifier is a fairly simple, probabilistic classifier based on
applying Bayes' theorem with strong (naive) independence assumptions between
features. What this means is that a Naive Bayes classifier will assume a
[statistical independence](<https://en.wikipedia.org/wiki/Independence_(probability_theory)>)
between features despite there being a possible strong correlation. However in
spite of this apparent over-simplified assumption Naive Bayes classifiers have
been know to perform rather well in some real-world applications.

```python
from sklearn.naive_bayes import GaussianNB

naive_bayes = GaussianNB()
results.loc['Naive Bayes'] = test_classifier(naive_bayes, my_dataset, features_list)
```

```
GaussianNB(priors=None)
 Accuracy: 0.75621 Precision: 0.25289 Recall: 0.36150 F1: 0.29759 F2: 0.33290
 Total predictions: 14000 True positives:  723 False positives: 2136 False negatives: 1277 True negatives: 9864
```

From the results shown above we can see that even before making any
optimisations this classifier almost meets the requirements of this experiment
(0.3 for both precision and recall). However the high number of false negatives
is a concern meaning that over the many combinations of training/validation
subsets a huge number of persons of interest were not identified.

### Support Vector Machines

Support Vector Machines (SVM) attempt to find a hyperplane, also known as the
decision boundary, that divides two classes with the largest margin. That is an
SVM maximises the distance to the nearest point in both classes which
consequently maximises the robustness of the classification decision boundary.
This is a classic optimisation problem, putting correct classification above
maximising the margin. So there may be cases where the margin is reduced in
order to correctly classify all examples.

If a hyperplane does not exist that classifies all examples correctly the SVM
will do the "best it can" given specific hyperparameters, therefore
accommodating for outliers.

For non-linear decision boundaries there are functions (kernels) that take in a
low dimensional feature space and map it to a higher dimensional feature space.
This transforms a non-linearly separable feature space into one that can be
separated. Most importantly these functions can map the results back into a low
dimensional feature space.

Support vectors are the points that lie along the supporting hyperplane. One key
factor that plays into the complexity of the runtime for a support vector is the
penalty parameter, `C`. The penalty parameter allows for a soft-margin and
better generalization. The number of support vectors varies depending on the
penalty we allow and how the data is distributed. The lower the penalty the
fewer support vectors we get, creating a smoother decision boundary. Conversely
the higher the penalty the greater the number of support vectors, having the
effect of prioritising the number of correctly classified examples.

Another key factor into the complexity of a support vector is how far the
influence of a single training point reaches, controlled by the kernel
coefficient parameter, `gamma`. A low kernel coefficient has the effect of
creating a straighter decision boundary due to training examples further from
the hyperplane having a higher influence on the algorithm. On the other hand a
high kernel coefficient causes the decision boundary to become less linear
because only those examples closest to the decision boundary have any influence
on the algorithm.

```python
from sklearn.svm import LinearSVC

linear_svc = LinearSVC(C=1000.0)
results.loc['SVM'] = test_classifier(linear_svc, my_dataset, features_list)
```

```
LinearSVC(C=1000.0, class_weight=None, dual=True, fit_intercept=True,
     intercept_scaling=1, loss='squared_hinge', max_iter=1000,
     multi_class='ovr', penalty='l2', random_state=None, tol=0.0001,
     verbose=0)
 Accuracy: 0.73086 Precision: 0.22254 Recall: 0.35450 F1: 0.27343 F2: 0.31691
 Total predictions: 14000 True positives:  709 False positives: 2477 False negatives: 1291 True negatives: 9523
```

Many discussion forums, including the Udacity
[Intro to Machine Learning](https://discussions.udacity.com/t/final-project-error/25538/6?u=tomasbashamdy3)
forum, talk about how support vector machines commonly struggle on this
particular dataset which may explain why I was not able to get a result when
using the `sklearn.svm.SVC` classifier with an `rbf` kernel. Instead I have
selected to use the `sklearn.svm.LinearSVC` classifier which is similar to
`sklearn.svm.SVC` with a linear kernel, but instead is implemented in terms of
`liblinear` rather than `libsvm`. Because of this it has more flexibility in the
choice of penalties and loss functions and should scale better to large numbers
of samples.

Unlike the other classifiers in this section I had to tune the penalty
parameter, `C`, otherwise the classifier was not returning in a reasonable
amount of time (if at all). This I think is likely due to the many features
contained in the dataset that may possibly not be linearly separable. Using a
higher penalty parameter allows the classifier to priorities correctness over
smooth decision boundaries.

Despite my best efforts the linear Support Vector Machine classifier has
performed similarly to Naive Bayes, arguably slightly worse, with both a
slightly lower number of true positives and equally slightly higher number of
false negatives.

### Random Forest

Random Forest classifiers are a specific type of bootstrap aggregated (or
bagged) decision tree, an early ensemble method, that builds multiple decision
trees by repeatedly resampling training data with replacement, and voting the
trees for a consensus prediction. That is a Random Forest classifier is composed
of a number of smaller classifiers, in this case decision trees: a
non-parametric supervised learning method used for both classification and
regression.

Decision trees attempt to create a model that predicts the value of a target
variable (represented by the leaves) by learning simple rules informed by the
features within a dataset. These rules create decision boundaries (represented
by the branches) that attempt to separate dissimilar examples.

A tree can be "learned" by splitting the input data into subsets based on an
attribute value test. This process is repeated on each derived subset in a
recursive manner called recursive partitioning. The recursion is completed when
the subset at a node has all the same value of the target variable, or when
splitting no longer adds value to the predictions. This process of top-down
induction of decision trees is an example of a greedy algorithm, and it is by
far the most common strategy for learning decision trees from data.

However One of the issues with decision tree learners is that they can create
over-complex trees that do not generalise well from the training data. Random
decision forests correct for decision trees' habit of overfitting to their
training set.

An important factor that governs the performance of a random forest is the
number of decision tree the compose it. I believe it is generally accepted that
the greater number of decision trees the more confidence we can gain from the
consensus. However more decision trees, and therefore more subsamples of the
training data, result in a classifier that is much slower to train.

Another interesting parameter is the
[criterion](https://en.wikipedia.org/wiki/Decision_tree_learning#Metrics). This
dictates the function used to measure the impurity of a decision boundary. The
`sklearn.tree.DecisionTreeClassifier` used here implements 2 known functions to
measure boundary impurity. The first is
[information gain](https://en.wikipedia.org/wiki/Information_gain_in_decision_trees)
and is intended for classification problems, similar to that of this experiment.
The second function is gini impurity, intended for continuous values and
therefore more appropriate for regression problems. It is interesting to note
that both information gain and gini impurity are largely similar as metrics and
generally the performance of a classifier will not differ using one or the
other. There was a paper written comparing these two metrics where the most
important remarks were:

- It only matters in 2% of the cases whether you use gini impurity or entropy.
- Entropy might be a little slower to compute (because it makes use of the
  logarithm).

```python
from sklearn.ensemble import RandomForestClassifier

random_forest = RandomForestClassifier()
results.loc['Random Forest'] = test_classifier(random_forest, my_dataset, features_list)
```

```
RandomForestClassifier(bootstrap=True, class_weight=None, criterion='gini',
            max_depth=None, max_features='auto', max_leaf_nodes=None,
            min_impurity_decrease=0.0, min_impurity_split=None,
            min_samples_leaf=1, min_samples_split=2,
            min_weight_fraction_leaf=0.0, n_estimators=10, n_jobs=1,
            oob_score=False, random_state=None, verbose=0,
            warm_start=False)
 Accuracy: 0.86357 Precision: 0.55257 Recall: 0.23650 F1: 0.33123 F2: 0.26705
 Total predictions: 14000 True positives:  473 False positives:  383 False negatives: 1527 True negatives: 11617
```

From the above results I am rather impressed with the fairly high precision this
classifiers offers without having performed any hyperparameter tuning or other
machine learning techniques. However the recall seems to have suffered even more
greatly than the support vector machine classifier. This is a cause for concern
since in my opinion the recall is of greater importance in this experiment than
the precision. Even more concerning is the increase in false negatives. This is
a really undesirable feature of this classifier and can hopefully be improved
through tuning. However despite this the F1 score has improved upon both the
Naive Bayes and SVM classifiers due to the significant boost in precision.

### AdaBoost

<https://en.wikipedia.org/wiki/AdaBoost>

```python
from sklearn.ensemble import AdaBoostClassifier

adaboost = AdaBoostClassifier()
results.loc['AdaBoost'] = test_classifier(adaboost, my_dataset, features_list)
```

```
AdaBoostClassifier(algorithm='SAMME.R', base_estimator=None,
          learning_rate=1.0, n_estimators=50, random_state=None)
 Accuracy: 0.87043 Precision: 0.55609 Recall: 0.46100 F1: 0.50410 F2: 0.47732
 Total predictions: 14000 True positives:  922 False positives:  736 False negatives: 1078 True negatives: 11264
```

By far the most performant out-of-the-box classifier, AdaBoost already scores
high enough to have achieved the criteria for this experiment. Most impressively
it has attained more true and false positives than any of the other classifiers.
This indicates that currently this classifier errs on the side of positive
classification (marking examples as persons of interest). This is a favourable
trade-off likely meaning many more persons of interest will be correctly
classified as such. However I am still concerned with the number of false
negatives this classifier yields. Whilst it is the lowest of all the classifiers
it still remains too high to give a satisfactory level of confidence to dismiss
an individual Enron employee.

Below is the full table of results for comparison.

```python
results.sort_values(by='f1', ascending=False)
```

<div class="table-wrapper" markdown="block">

|               | accuracy | precision | recall | f1   | f2   |
| ------------- | -------- | --------- | ------ | ---- | ---- |
| AdaBoost      | 0.87     | 0.56      | 0.46   | 0.50 | 0.48 |
| Random Forest | 0.86     | 0.55      | 0.24   | 0.33 | 0.27 |
| Naive Bayes   | 0.76     | 0.25      | 0.36   | 0.30 | 0.33 |
| SVM           | 0.73     | 0.22      | 0.35   | 0.27 | 0.32 |

</div>
