---
layout: post
title: Evaluation Metrics for Machine Learning
description: Investigation into fraud at Enron, continuing with assessing evaluation metrics.
category: machine learning
tags: accuracy data enron evaluation f-measure mathematics metrics precision recall statistics
---

Before continuing to implement a predictive model and investigating different
classifiers I want to discuss the evaluation metrics I'll be using to determine
the suitability of each classifier. This is an important topic as without
knowing what we're measuring it will not be possible to meaningfully improve and
tune our predictive model.

It follows that each evaluation metric favours one type of error over another,
thus allowing a predictive model to be tuned and optimised for specific
outcomes. For examples some metrics are more sensitive to false positives which
will in the case of the Enron dataset tend to classify more employees as persons
of interest than perhaps are.

### Accuracy

Standard accuracy is a ratio of correct classifications to the total number of
classifications:

$$
\begin{aligned}
accuracy & = \frac{\text{number of data points labelled correctly}}{\text{number of data points}}
\end{aligned}
$$

It is therefore an overall measure of correct classification over all classes,
that assigns equal cost to false positives and false negatives.

When the class distribution is heavily imbalanced (for example more non-POIs
than POIs) a model can predict the value of the majority class for all
predictions and achieve a high classification accuracy. In this case accuracy is
just a measure of how good our predictive model is at guessing. To put this into
perspective a predictive model that always predicted false when trying to
identify persons of interest on our cleaned dataset would achieve an accuracy of
87%.

This causes issues when in reality there are unequal costs associated with
errors (false positives vs false negatives). In the Enron dataset the cost of a
false positive may be far less than the cost of a false negative where those
falsely labelled as a person of interest could later be absolved from any crime.

Clearly this metric would not satisfy the objectives of this investigation that
requires we implement a predictive model capable of identifying persons of
interest.

### Balanced Accuracy

http://scikit-learn.org/stable/modules/generated/sklearn.metrics.balanced_accuracy_score.html#sklearn.metrics.balanced_accuracy_score

https://en.wikipedia.org/wiki/Precision_and_recall

### Precision

Precision is defined as the number of true positives divided by the number of
true positives and false positives:

$$
\begin{aligned}
precision & = \frac{\text{true positives}}{\text{true positives} + \text{false positives}}
\end{aligned}
$$

Put more simply precision (also called the positive predictive value) measures
the proportion of true positives that actually belong to the positive class. It
is a measure of confidence that when the predictive model classifies an example
as positive that it has been correctly classified.

In terms of the Enron dataset precision expresses that for every employee
classified as a person of interest the probability that this employee really is
a person of interest.

A positive result from a predictive model with a high precision is useful for
ruling out a possible negative classification since it rarely predicts negative
for the truly positive examples in the dataset. Therefore a model with 100%
precision can confidently say all positively classified examples are truly
positive. In this case a positive result would definitively rule out a negative
classification.

On the other hand a negative result from a predictive model with a high
precision does not guarantee a truly negative classification. This is because
precision does not take into account false negatives. Therefore a model with
100% precision may not recognise some examples that should belong to the
positive class.

In other words precision errs on the side of negative classification as it is
reluctant to "pull the trigger" on edge cases. Therefore it will favour
classifying Enron employees as non-POIs which presents a high cost as
potentially many persons of interest will go undetected.

### Recall

Recall is defined as the number of true positives divided by the number of true
positives and false negatives:

$$
\begin{aligned}
recall & = \frac{\text{true positives}}{\text{true positives} + \text{false negatives}}
\end{aligned}
$$

Put more simply recall (also called the true positive rate or sensitivity)
measures the proportion of true positives that are correctly classified as such.
Equivalently recall is the extent to which true positives are not overlooked (so
false negatives are few) and thus a highly sensitive predictive model rarely
overlooks a true positive.

In terms of the Enron dataset recall returns the proportion of employees who are
classified as persons of interest among those who truly are persons of interest.

A negative result from a predictive model with a high recall is useful for
ruling out a possible positive classification since it rarely predicts positive
for the truly negative examples in the dataset. Therefore a model with 100%
recall will recognise all truly positive examples. In this case a negative
result would definitively rule out a positive classification.

Conversely a positive result from a predictive model with a high recall does not
guarantee a truly positive classification. This is because recall does not take
into account false positives. Therefore a model with 100% recall will recognise
not only truly positive examples but may also include many false positives.

Since recall quantifies the avoiding of false negatives this evaluation metric
is ideal for the Enron dataset whereby not correctly identifying an employee as
a person of interest has a much greater cost than falsely identifying an
innocent employee of being a person of interest.

### F-Measure

The F-measure is a weighted average of the precision and recall, with the
traditional F-measure or balanced F-score (F1 score) being the harmonic average
of the precision and recall:

$$
\begin{aligned}
F_{1} & = 2 \cdot \left(\frac{precision \cdot recall}{precision + recall}\right)
\end{aligned}
$$

This measure is approximately the average of both precision and recall when they
are close, and is more generally the harmonic mean, which, for the case of two
numbers, coincides with the square of the geometric mean divided by the
arithmetic mean. The F1 score reaches its best value at 1 (indicating perfect
precision and recall) and worst at 0. In its more general form the F-measure is
defined as:

$$
\begin{aligned}
F_{\beta} & = \left(1 + \beta^2\right) \cdot \left(\frac{precision \cdot recall}{\beta^2 \cdot precision + recall}\right)
\end{aligned}
$$

This gives us a parameterised version of the F-measure allowing us to specify
the preferred weights for each error type (false positives and false negatives).
As discussed above we are more interested in maximising the recall since it
avoids false negatives. Therefore we can use the F2 score, which weighs recall
twice as high as precision (thus placing more emphasis on false negatives).
Plugging in the values the F2 score is defined as:

$$
\begin{aligned}
F_{2} & = 5 \cdot \left(\frac{precision \cdot recall}{4 \cdot precision + recall}\right)
\end{aligned}
$$

For this investigation it is a requirement that our classifier achieves both a
precision and recall greater than `0.3`. However it should be possible to
achieve a better result given the optimal features are selected and
hyperparameters given. Therefore when I later attempt to optimise my classifier
I would like to lean towards maximising the F2 score. However sklearn does not
seem to provide F2 as a possible
[scoring function](http://scikit-learn.org/stable/modules/model_evaluation.html#scoring-parameter)
so I will fallback to maximising the F1 score.
