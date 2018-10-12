---
layout: post
title: Data Cleansing and Machine Learning
description: Investigation into fraud at Enron, continuing with cleaning public data.
category: machine learning
tags: cleaning data enron pandas python
---

In a previous post we focussed on exploring the Enron dataset that will be key
in creating a predictive model capable of identifying who played part in the
Enron scandal in the early 2000s. In this post we'll pay our attention to
analysing the dataset, ensuring the values we have are in fact accurate
according to the financial records available from the original FindLaw report.

In particular there are two features that should total the values of other
features in the dataset. These features are `total_payments` and
`total_stock_value`.

Starting with the features relating to payment we're able to find two examples
where the `total_payments` feature is not equal to the sum of all the other
payment features: `salary`, `bonus`, `long_term_incentive`, `deferred_income`,
`deferral_payments`, `loan_advances`, `other`, `expenses`, `director_fees`.

```python
def inaccurate_examples(features):
    '''
    Return a function that checkes for data inconsistencies.
    '''
    def sum_features(data):
        '''
        Sum along the columns of all passed features, excluding the last,
        and compare the value to the last feature.
        '''
        return data[data[features[:-1]].sum(axis='columns').ne(data[features[-1]], fill_value=0)][features]
    return sum_features

# In the order specified in the FindLaw report.
payment_features = ['salary', 'bonus', 'long_term_incentive', 'deferred_income', 'deferral_payments',
                   'loan_advances', 'other', 'expenses', 'director_fees', 'total_payments']

inaccurate_payment_examples = inaccurate_examples(payment_features)
inaccurate_payment_examples(enron_data)
```

<div class="table-wrapper" markdown="block">

|                  | salary | bonus | long_term_incentive | deferred_income | deferral_payments | loan_advances | other     | expenses | director_fees | total_payments |
| ---------------- | ------ | ----- | ------------------- | --------------- | ----------------- | ------------- | --------- | -------- | ------------- | -------------- |
| BELFER ROBERT    | nan    | nan   | nan                 | nan             | -102500.00        | nan           | nan       | nan      | 3285.00       | 102500.00      |
| BHATNAGAR SANJAY | nan    | nan   | nan                 | nan             | nan               | nan           | 137864.00 | nan      | 137864.00     | 15456290.00    |

</div>

Similarly we're able to find two examples where the `total_stock_values` feature
is not equal to the sum of all the other stock features:
`exercised_stock_options`, `restricted_stock`, `restricted_stock_deferred`,
`total_stock_value`.

```python
# In the order specified in the FindLaw report.
stock_value_features = [
  'exercised_stock_options',
  'restricted_stock',
  'restricted_stock_deferred',
  'total_stock_value'
]

inaccurate_stock_value_examples = inaccurate_examples(stock_value_features)
inaccurate_stock_value_examples(enron_data)
```

<div class="table-wrapper" markdown="block">

|                  | exercised_stock_options | restricted_stock | restricted_stock_deferred | total_stock_value |
| ---------------- | ----------------------- | ---------------- | ------------------------- | ----------------- |
| BELFER ROBERT    | 3285.00                 | nan              | 44093.00                  | -44093.00         |
| BHATNAGAR SANJAY | 2604490.00              | -2604490.00      | 15456290.00               | nan               |

</div>

In both cases the same two names are reported to be inaccurate. This is likely
the result of an input error so we'll have to correct this.

In the original report, `-102,500` is listed as Robert Belfer’s deferred income,
not deferral payments whilst `3,285` is listed as his expenses, and director
fees listed as `102,500`, making total payments equal to `3,285`. Furthermore
there is no listing for Robert Belfer's exercised stock options whilst his
restricted stock and restricted stock deferred are listed as `44093` and
`-44093` respectively. It would appear that everything has been shifted one
column to the right. We’ll have to move it one to the left to fix it. The
opposite happened to Sanjay Bhatnagar, so we’ll have to move his columns to the
right to fix them.

```python
# First Robert Belfer...
enron_data.loc[('BELFER ROBERT','deferred_income')] = -102500
enron_data.loc[('BELFER ROBERT','deferral_payments')] = np.nan
enron_data.loc[('BELFER ROBERT','expenses')] = 3285
enron_data.loc[('BELFER ROBERT','director_fees')] = 102500
enron_data.loc[('BELFER ROBERT','total_payments')] = 3285
enron_data.loc[('BELFER ROBERT','exercised_stock_options')] = np.nan
enron_data.loc[('BELFER ROBERT','restricted_stock')] = 44093
enron_data.loc[('BELFER ROBERT','restricted_stock_deferred')] = -44093
enron_data.loc[('BELFER ROBERT','total_stock_value')] = np.nan

# ... and then Snajay Bhatnagar.
enron_data.loc[('BHATNAGAR SANJAY','total_payments')] = 137864
enron_data.loc[('BHATNAGAR SANJAY','restricted_stock_deferred')] = -2604490
enron_data.loc[('BHATNAGAR SANJAY','total_stock_value')] = 15456290
enron_data.loc[('BHATNAGAR SANJAY','expenses')] = 137864
enron_data.loc[('BHATNAGAR SANJAY','exercised_stock_options')] = 15456290
enron_data.loc[('BHATNAGAR SANJAY','other')] = np.nan
enron_data.loc[('BHATNAGAR SANJAY','restricted_stock')] = 2604490
enron_data.loc[('BHATNAGAR SANJAY','director_fees')] = np.nan
```

Lets check that we have fixed the issues.

```python
inconsistencies = len(inaccurate_payment_examples(enron_data)) + \
    len(inaccurate_stock_value_examples(enron_data))

print('Number of inconsistencies:', inconsistencies)

```

```
Number of inconsistencies: 0
```

This is looking good and was an important step in ensuring the data we have will
be suitable to model patterns an trends and later used to make predictions. If
we had not corrected these issue we may have later found our predictive model to
not make accurate predictions. However there is still some work outstanding
before this data can be used to make predictions. Namely we need to decide what
do to about missing and incomplete data. This will be covered in the next post.
