---
title: Atlas
url: https://atlas.implantait.com/
---

The Atlas project originated in a hackathon. And as time went by, it became the biggest project of my career. The goal was to be able to use functionalities similar to NotebookLM, but the company has serious compliance restrictions, and 50 dollars per seat was not pleasant at all. Initially, the project flowed well. I managed to develop the entire ACL access management in just seven days and was able to reuse the frontend part of a project made by Nuxt Labs, and this greatly shortened the idea validation process.

We won first place among the hackathons, and I was the only developer involved. But after this first validation, the project still went through many stages. Validating an idea in a controlled environment is one thing, and the production environment is another. In these early stages, we were still testing open-weights models, and after changing from qwen-2.5:7b to qwen-3.5:7b, it resulted in text outputs that hallucinated in Chinese. And that was when the idea of implementing observability with Langfuse arose. However, due to compliance issues, Langfuse was discontinued shortly after we developed our own telemetry system. I had the opportunity to test ways to improve the NaiveRAG we were using at the time, and that's when I learned more about other architectures. My first attempt was the one that had the highest accuracy, but it had a very serious problem with token usage and a very delayed response time (which is GraphRag). After seeing the metrics in the telemetry, I ended up reverting this new architecture and migrated to Contextual Chunking Reciprocal Rank Fusion in BM25 (Contextual retrieval), which, thanks to the pre-processing of the documents to add context, reduced the inference time by 20 seconds compared to GraphRag, and still maintained the consistency of the responses.

For guardrails, initially, I tested smaller models specifically finetuned for this, but I got many false positives and negatives. And so I ended up using the same model with another prompt to evaluate, annotate, and terminate streams when necessary. Small models are good with small contexts, but even so, I noticed some hallucination in less than 1% of the conversations I analyzed. It turns out that contextual retrieval alone is still not enough, so I made a mix of it with SelfRag, which gives the model the opening to view the adjacent chunks.

As the project advanced to the final stages, the need arose to use frontier models to support massive context windows via MCP, since our clients use other products within the company, and these products had no integration with Atlas until then. But the problem is that, due to compliance, we cannot deliver sensitive information to an external AI provider. It turns out I had been preparing for when this moment arrived since the hackathon.

To anonymize PIIs, I used the Microsoft Presidio Analyser and created an anonymization layer across the entire state of the conversation and the tools, thus, the agent passes only entities like <|%PERSON_1%|> to the external model. And in the same way, the stream is received by this same layer and de-anonymized before reaching the client.

As for the MCPs part, I created a table in the database with an application pivot (pg-vector) to be able to use the same MCP in different groups.

Another cool functionality regarding retrieval was that I was also able to bring restricted content just to inform the user that the server has the information they are looking for, but that it is in another group. This functionality was made in a totally deterministic and secure way.

To validate the MCP client, I created a small server with about 20 different reports with totally anonymized data and managed to do a demonstration of the input and output data in the anonymization stage before demonstrating this new capability to the clients. I did this because no client would like to have their data used as test guinea pigs.

The current stage of the project is the homologation of 2 multinationals, and we already have several success cases on the part of the clients.

Today the project is led by me (Gabriel Serejo) and has three other software engineers working under my tutelage.