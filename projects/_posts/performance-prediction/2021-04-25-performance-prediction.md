---
layout: post
title: Performance Prediction of Multi-threaded Applications
date: 2021-04-25 11:58:47 +07:00
modified: 2021-04-25 16:49:47 +07:00
tags: [multithreading, parsec, speedup, random-forest, lasso, artificial-neural-network]
---
<p style="text-align: justify;">
In recent years, owing to the advancement in parallel programming, it is becoming crucial to evaluate the performance of multithreaded applications. Most of the times, just allocating resources and using expensive hardware does not guarantee speedup and hence it is important to do code instrumentation. According to Amdahl’s law, many programs might not be parallelizable. Sometimes, the parallelisation overhead might not give the expected speedup. In this paper, we are proposing a learning-based approach to predict the execution time and hence the speedup of an unseen program on a given machine using application characteristics for specific hardware.
The authors believe that the speedup depends on a lot of factors which we have showcased in this research. We are not only comparing several machine learning models to show which model works best to predict the performance but also evaluating the features that have a major impact on the performance of the multithreaded application. This research can help programmers rectify those bottlenecks for efficient performance.
</p>
More on this project can be found <a href="https://github.com/Aman-Chopra/Performance-Prediction-Multithreaded-Applications" target="_blank">here</a>