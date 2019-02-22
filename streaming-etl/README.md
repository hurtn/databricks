# Streaming ETL with Azure Databricks using Structured Streaming and Databricks Delta

Please see [my blog](https://medium.com/@Nicholas_Hurt/an-introduction-to-streaming-etl-on-azure-databricks-using-structured-streaming-databricks-16b369d77e34) for the full background to this demonstration.

## Scenario

Assume the business is in the advertising sector and monitors the volume of adverts displayed (impressions) on certain websites. They are only interested in adverts displaying particular brands. The business is not interested in the usual clicks and conversions. In this scenario, adverts and impressions arrive as a continuous stream / feed of json messages (could be files) from a 3rd party. Adverts contain metadata such as when it was created, a unique identifier, name and which brand it pertains to. Impressions are, when, and on which site, an advert was displayed, including the session and user information. Fortunately we have an advert ID in both to link these however we don’t have any sort of unique key for each impression.

There are some static operational/reference sources which contain slowly changing data:

a SQL DB which contains a list of brands being monitoring
a web application which the operational team uses to maintain a list of domains that are being monitored.
For convenience, assume that both of these data sets are already pre-filtered by a 3rd party based on these specific brands and domains. Adverts are an important source of reference data and individual adverts need to be easily accessible by the operational application.

# Setup required
For full set up please follow the steps defined in [Part II](https://medium.com/@Nicholas_Hurt/an-introduction-to-streaming-etl-on-azure-databricks-using-structured-streaming-databricks-delta-f0f57ac7aa67) of my blog.

For minimal set up please see [this section](https://medium.com/@Nicholas_Hurt/an-introduction-to-streaming-etl-on-azure-databricks-using-structured-streaming-databricks-delta-50cd5194435a#4458) in part III
