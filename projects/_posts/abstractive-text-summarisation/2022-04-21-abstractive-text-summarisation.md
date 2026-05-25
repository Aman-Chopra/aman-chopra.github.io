---
layout: post
title: Abstractive Text Summarisation using Transformers
date: 2022-04-21 10:00:00 +07:00
tags: [machine-learning, transformers, lstm, nlp]
github_repo: Aman-Chopra/Abstractive-Text-Summarization
language: Python
mermaid: true
---
<p style="text-align: justify;">
Abstractive text summarization focuses on generating a meaningful summary of the given text as opposed to extractive text summarization which concatenates important sentences from the paragraph. 
In recent years most of the research being done in Abstractive text Summarization has been based on Recurrent Neural Networks, but RNN based approaches don't do well when long sequences are taken into consideration. 
In this project, we have explored the state-of-the-art Transformer Neural Networks and have applied them to the problem of solving abstractive text summarization. We propose a Transformer based neural network and then compare the results 
obtained by Transformers with a Bi-Directional LSTM with Attention for the dataset we have used. 
Our experimental results show that Transformers perform as well as Bi-LSTMs on the dataset that we have chosen. Transformers however increase the training efficiency and decrease the training times per epoch by a whole lot.</p>

### Transformer Seq2Seq Encoder-Decoder Architecture

```mermaid
flowchart LR
    Input["Input Article Tokens"] -- "Positional Encoding" --> Enc["Encoder Stack"]
    Enc -- "Self-Attention Blocks" --> EncOut["Context Representations"]
    EncOut -- "Key/Value Vectors" --> Attn["Multi-Head Attention Alignment"]
    
    PrevOut["Generated Summary Tokens"] -- "Positional Encoding" --> Dec["Decoder Stack"]
    Dec -- "Masked Self-Attention" --> Attn
    Attn -- "Attention Output" --> Linear["Linear Projection"]
    Linear -- "Softmax probabilities" --> Prob["Next Token Prediction"]

    style Enc fill:#3572A5,stroke:#fff,stroke-width:2px,color:#fff
    style EncOut fill:#3572A5,stroke:#fff,stroke-width:2px,color:#fff
    style Dec fill:#ff5277,stroke:#fff,stroke-width:2px,color:#fff
    style Attn fill:#1DB954,stroke:#fff,stroke-width:2px,color:#fff
    style Linear fill:#1DB954,stroke:#fff,stroke-width:2px,color:#fff
    style Prob fill:#1DB954,stroke:#fff,stroke-width:2px,color:#fff
```

<br><br>
More on this project can be found <a href="https://github.com/Aman-Chopra/Abstractive-Text-Summarization" target="_blank">here</a>
