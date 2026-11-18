---
layout: post
title: Identifying Fraud from Public Enron Data
description: Investigation into fraud at Enron, beginning with a project overview and data exploration
category: machine-learning
tags: enron pandas python statistics
series: enron
---

In 2000, Enron Corporation was an American energy, commodities, and services
company based in Houston, Texas. It was founded in 1985 as a merger between
Houston Natural Gas and InterNorth, both relatively small regional companies.
Before its bankruptcy on December 2, 2001, Enron employed approximately 20,000
staff and was a major electricity, natural gas, communications and pulp and
paper company, with claimed revenues of nearly $101 billion during 2000. Fortune
named Enron "America's Most Innovative Company" for six consecutive years.

At the end of 2001, it was revealed that Enron's reported financial condition
was sustained by institutionalised, systematic, and creatively planned
accounting fraud, known since as the Enron scandal. Enron has since become a
well-known example of wilful corporate fraud and corruption. The scandal also
brought into question the accounting practices and activities of many
corporations in the United States and was a factor in the enactment of the
Sarbanes–Oxley Act of 2002. The scandal also affected the greater business world
by causing the dissolution of the Arthur Andersen accounting firm, which had
been Enron's main auditor for years.

The following series of articles detail the final project of the Udacity machine
learning course which I completed the end of 2018. The objective: to implement
and optimise a predictive model using the financial and email data provided by
the Enron dataset, with the capacity to identify persons of interest (POIs).
Specifically the project intends to demonstrate working with a real world
dataset, performing data cleansing tasks and preparing the data; using feature
selection and engineering techniques; possible dimensionality reduction;
supervised classification and hyperparameter tuning; and validation.

_This series of posts is a write up of a jupyter notebook used to conduct this
experiment. The original notebook can be found on GitHub at
[#tomasbasham/ud120-projects](https://github.com/tomasbasham/ud120-projects)._

To help guide the implementation of this project and address some key points
we'll attempt to follow the
[rubric](https://review.udacity.com/#!/rubrics/27/view) provided by the Udacity
team. Moreover we'll be using some typical statistical and visualisation tools
during this project. Since these are under very active development it may be
necessary to use the same versions detailed in this post if wanting to replicate
the results.

```python
from __future__ import print_function

# scipy
import scipy
print('scipy: %s' % scipy.__version__)

# scikit-learn
import sklearn
print('sklearn: %s' % sklearn.__version__)

# numpy
import numpy
print('numpy: %s' % numpy.__version__)

# matplotlib
import matplotlib
print('matplotlib: %s' % matplotlib.__version__)

# pandas
import pandas
print('pandas: %s' % pandas.__version__)
```

```
scipy: 1.0.0
sklearn: 0.19.1
numpy: 1.14.0
matplotlib: 2.1.2
pandas: 0.22.0
```

## Data Structure

The Enron dataset is a collection of key/value pairs associating Enron employees
(the keys) with a collection of labelled features (the values). The labelled
features for each employee are represented by a dictionary and include the
following data:

- Financial features (all units in US dollars):
  - `bonus`
  - `deferral_payments`
  - `deferred_income`
  - `director_fees`
  - `exercised_stock_options`
  - `expenses`
  - `loan_advances`
  - `long_term_incentive`
  - `other`
  - `restricted_stock`
  - `restricted_stock_deferred`
  - `salary`
  - `total_payments`
  - `total_stock_value`
- Email features (most units are integers with exception to `email_address`
  which is a string)
  - `email_address`
  - `from_messages`
  - `from_poi_to_this_person`
  - `from_this_person_to_poi`
  - `shared_receipt_with_poi`
  - `to_messages`
- Labels (boolean, represented as an integer)
  - `poi`

## Data Exploration

This first post examines the data that we have to work with. It is very often
the case that a dataset will contain errors, and it is imperative that these
errors are resolved before making any further analysis of the data at hand. If
the errors are not resolved then the final predictive model may not generalise
well to any new data it receives.

When examining the data we are trying to answer the following:

- Are there any errors in the data?
- Are there any outliers in the data?
- Are there any missing values in the data?
- Does the data represent a realistic range of values?

Let's start by reading the data from the provided `pkl` file. This extension
expresses that the data is stored in a Pickle file, used to serialise and
deserialise Python data objects into a sequence of raw bytes that may be more
efficiently stored on disk.

```python
import pickle

# Load the dictionary containing the dataset.
with open('final_project_dataset.pkl', 'r') as data_file:
    data_dict = pickle.load(data_file)

# Sanity check
assert type(data_dict) is dict
```

By the lack of error we may conclude we have a dictionary. Dictionaries are a
primitive data structure in python; but whilst they provide a simple interface
through which data may be manipulated they are not flexible enough to perform
many statistical operations. Instead this data can be loaded into a Pandas
DataFrame: A two-dimensional size-mutable, tabular data structure with labelled
axes (rows and columns).

```python
import pandas as pd

# Use 2 decimal place output instead of scientific notation. It is far easier to read and compare.
pd.set_option('display.float_format', lambda x: '%.2f' % x)

# Transpose the data so the names are used as indices.
enron_data = pd.DataFrame.from_dict(data_dict, orient='index')
enron_data.head()
```

<div class="table-wrapper" markdown="block">

|                    | salary | to_messages | deferral_payments | total_payments | exercised_stock_options | bonus   | restricted_stock | shared_receipt_with_poi | restricted_stock_deferred | total_stock_value | ... | loan_advances | from_messages | other   | from_this_person_to_poi | poi   | director_fees | deferred_income | long_term_incentive | email_address              | from_poi_to_this_person |
| ------------------ | ------ | ----------- | ----------------- | -------------- | ----------------------- | ------- | ---------------- | ----------------------- | ------------------------- | ----------------- | --- | ------------- | ------------- | ------- | ----------------------- | ----- | ------------- | --------------- | ------------------- | -------------------------- | ----------------------- |
| ALLEN PHILLIP K    | 201955 | 2902        | 2869717           | 4484442        | 1729541                 | 4175000 | 126027           | 1407                    | -126027                   | 1729541           | ... | NaN           | 2195          | 152     | 65                      | False | NaN           | -3081055        | 304805              | <phillip.allen@enron.com>    | 47                      |
| BADUM JAMES P      | NaN    | NaN         | 178980            | 182466         | 257817                  | NaN     | NaN              | NaN                     | NaN                       | 257817            | ... | NaN           | NaN           | NaN     | NaN                     | False | NaN           | NaN             | NaN                 | NaN                        | NaN                     |
| BANNANTINE JAMES M | 477    | 566         | NaN               | 916197         | 4046157                 | NaN     | 1757552          | 465                     | -560222                   | 5243487           | ... | NaN           | 29            | 864523  | 0                       | False | NaN           | -5104           | NaN                 | <james.bannantine@enron.com> | 39                      |
| BAXTER JOHN C      | 267102 | NaN         | 1295738           | 5634343        | 6680544                 | 1200000 | 3942714          | NaN                     | NaN                       | 10623258          | ... | NaN           | NaN           | 2660303 | NaN                     | False | NaN           | -1386055        | 1586055             | NaN                        | NaN                     |
| BAY FRANKLIN R     | 239671 | NaN         | 260455            | 827696         | NaN                     | 400000  | 145796           | NaN                     | -82782                    | 63014             | ... | NaN           | NaN           | 69      | NaN                     | False | NaN           | -201641         | NaN                 | <frank.bay@enron.com>        | NaN                     |

<p>5 rows × 21 columns</p>
</div>

We're in luck! The data could be read into a Pandas DataFrame. This will make it
far easier to explore in the following sections and allows for any changes made
to be re-exported as a simple dictionary.

The indexes are the names of Enron employees. There are several familiar names
in the expanded list closely linked to the Enron scandal, including Kenneth Lay,
Jeffrey Skilling, Andrew Fastow, and Cliff Baxter. There are also many lesser
known names in the list that are hopefully equally useful in describing the
patterns we'll later discover in the data.

Additionally there is an entry for "The Travel Agency in the Park" that is noted
in the footnotes of the original
[FindLaw](http://cdn.tomasbasham.dev/posts/enron-machine-learning/enron61702insiderpay.pdf)
document and states that payments were made to this company by Enron and that
this business was co-owned by the sister of Enron’s former Chairman. From an
accounting perspective this information is very relevant but I suspect this will
impede our predictive model. Therefore this entry is a good candidate to be
omitted in later sections.

The columns describe the features available in the dataset. They are expressive
enough that we may understand what each value represents but unfortunately they
do not indicate their unit of measurement. Luckily we're told how each value is
represented in the original FindLaw document so this will not be an issue.

One of the first things of note is there seems to be a lot of missing data
scattered throughout the dataset. This is indicated by the `NaN` string. Python
will not be able to interpret this as missing data and may present issues when
plotting features and performing any data manipulation. Instead we can tell
Pandas to replace missing values by specifying our missing value marker.

```python
import numpy as np

# NumPy uses the IEEE Standard for Binary Floating-Point for Arithmetic (IEEE 754).
# This means that Not a Number is not equivalent to infinity.
enron_data = enron_data.replace('NaN', np.nan)

type(enron_data.loc['ALLEN PHILLIP K'].director_fees)
```

```
numpy.float64
```

Great! Now that Pandas is aware of missing data and we have some sensible data
to work with, let's print out a few statistics.

```python
# Print information about the data frame.
enron_data.info()
print()

# Justify the output of statistics.
print_stat = lambda t, stat: print('{}:'.format(t).ljust(28), stat)

# Print a few statistics not included in the above.
print_stat('Number of data points', enron_data.shape[0] * enron_data.shape[1])
print_stat('Number of missing values', enron_data.isna().sum().sum())
print_stat('Number of POIs', len(enron_data[enron_data['poi'] == True]))
```

```
<class 'pandas.core.frame.DataFrame'>
Index: 146 entries, ALLEN PHILLIP K to YEAP SOON
Data columns (total 21 columns):
salary                       95 non-null float64
to_messages                  86 non-null float64
deferral_payments            39 non-null float64
total_payments               125 non-null float64
exercised_stock_options      102 non-null float64
bonus                        82 non-null float64
restricted_stock             110 non-null float64
shared_receipt_with_poi      86 non-null float64
restricted_stock_deferred    18 non-null float64
total_stock_value            126 non-null float64
expenses                     95 non-null float64
loan_advances                4 non-null float64
from_messages                86 non-null float64
other                        93 non-null float64
from_this_person_to_poi      86 non-null float64
poi                          146 non-null bool
director_fees                17 non-null float64
deferred_income              49 non-null float64
long_term_incentive          66 non-null float64
email_address                111 non-null object
from_poi_to_this_person      86 non-null float64
dtypes: bool(1), float64(19), object(1)
memory usage: 29.1+ KB

Number of data points:       3066
Number of missing values:    1358
Number of POIs:              18
```

It looks like we have lots of integers, and two single columns of strings and
booleans. The boolean column, `poi` indicates whether the person is a “Person of
Interest”. This is the column we’ll be trying to predict using the other data.
Additionally the above shows the following:

- There are 146 examples each containing 21 values,
- Of the 21 values there are 19 numerical features, 1 text feature ("email") and
  1 binary classification ("poi"),
- There are 3066 data points, of which 1358 are missing,
- 18 of the 146 examples are known persons of interest.

A significant proportion (44.3%) of the data is missing. From the table we can
see this is particularly prevalent in the features `deferral_payments`,
`deferred_income`, `director_fees`, `loan_advances` and
`restricted_stock_deferred`. At this time I will not remove any of these
features just in case they are still useful when attempting to derive patterns
in the data.

In addition to the summary statistics we can print some aggregate statistics
over each features in the dataset. This allows us to see some typical
statistical values that may unearth some useful information.

```python
enron_data.describe()
```

<div class="table-wrapper" markdown="block">

|       | salary      | to_messages | deferral_payments | total_payments | exercised_stock_options | bonus       | restricted_stock | shared_receipt_with_poi | restricted_stock_deferred | total_stock_value | expenses   | loan_advances | from_messages | other       | from_this_person_to_poi | director_fees | deferred_income | long_term_incentive | from_poi_to_this_person |
| ----- | ----------- | ----------- | ----------------- | -------------- | ----------------------- | ----------- | ---------------- | ----------------------- | ------------------------- | ----------------- | ---------- | ------------- | ------------- | ----------- | ----------------------- | ------------- | --------------- | ------------------- | ----------------------- |
| count | 95.00       | 86.00       | 39.00             | 125.00         | 102.00                  | 82.00       | 110.00           | 86.00                   | 18.00                     | 126.00            | 95.00      | 4.00          | 86.00         | 93.00       | 86.00                   | 17.00         | 49.00           | 66.00               | 86.00                   |
| mean  | 562194.29   | 2073.86     | 1642674.15        | 5081526.49     | 5987053.77              | 2374234.61  | 2321741.14       | 1176.47                 | 166410.56                 | 6773957.45        | 108728.92  | 41962500.00   | 608.79        | 919064.97   | 41.23                   | 166804.88     | -1140475.14     | 1470361.45          | 64.90                   |
| std   | 2716369.15  | 2582.70     | 5161929.97        | 29061716.40    | 31062006.57             | 10713327.97 | 12518278.18      | 1178.32                 | 4201494.31                | 38957772.73       | 533534.81  | 47083208.70   | 1841.03       | 4589252.91  | 100.07                  | 319891.41     | 4025406.38      | 5942759.32          | 86.98                   |
| min   | 477.00      | 57.00       | -102500.00        | 148.00         | 3285.00                 | 70000.00    | -2604490.00      | 2.00                    | -7576788.00               | -44093.00         | 148.00     | 400000.00     | 12.00         | 2.00        | 0.00                    | 3285.00       | -27992891.00    | 69223.00            | 0.00                    |
| 25%   | 211816.00   | 541.25      | 81573.00          | 394475.00      | 527886.25               | 431250.00   | 254018.00        | 249.75                  | -389621.75                | 494510.25         | 22614.00   | 1600000.00    | 22.75         | 1215.00     | 1.00                    | 98784.00      | -694862.00      | 281250.00           | 10.00                   |
| 50%   | 259996.00   | 1211.00     | 227449.00         | 1101393.00     | 1310813.50              | 769375.00   | 451740.00        | 740.50                  | -146975.00                | 1102872.50        | 46950.00   | 41762500.00   | 41.00         | 52382.00    | 8.00                    | 108579.00     | -159792.00      | 442035.00           | 35.00                   |
| 75%   | 312117.00   | 2634.75     | 1002671.50        | 2093263.00     | 2547724.00              | 1200000.00  | 1002369.75       | 1888.25                 | -75009.75                 | 2949846.75        | 79952.50   | 82125000.00   | 145.50        | 362096.00   | 24.75                   | 113784.00     | -38346.00       | 938672.00           | 72.25                   |
| max   | 26704229.00 | 15149.00    | 32083396.00       | 309886585.00   | 311764000.00            | 97343619.00 | 130322299.00     | 5521.00                 | 15456290.00               | 434509511.00      | 5235198.00 | 83925000.00   | 14368.00      | 42667589.00 | 609.00                  | 1398517.00    | -833.00         | 48521928.00         | 528.00                  |

</div>

Without a statistical background, further analysis is not particularly easy
unless we know that our data should fall in a particular range. It's usually
better to visualize the data in some way. Visualization makes outliers and
errors immediately stand out, whereas they might go unnoticed in a large table
of numbers. I'll investigate this further in the next post that will be on the
topic of data cleansing.
