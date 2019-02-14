Streaming ETL Demonstration

![https://cdn-images-1.medium.com/max/1600/1\*8Ga7W4tCO9qOxJdOaYiCsA.png](media/image1.png){width="6.268055555555556in"
height="2.225in"}

The first thing we will need is some streaming data. If you have a data
warehousing scenario, this may not be so easy. Data may be coming at you
from one or more source systems but often moving from batch to
real-time, always-on-ETL can be complex and difficult. Continuously
extracting (pushing or pulling) the data can end up placing a burden on
these source systems and is something you will have consider carefully,
and often at times be a little creative, like running this from your hot
DR or read-only replica database. You could consider proprietary tools
or write your own application to publish these insert/update/delete
events (records) to a stream. This is commonly called a "producer"
application.

For the purposes of demonstration in this blog I'm going to use a [[json
data generator
tool]{.underline}](https://github.com/everwatchsolutions/json-data-generator).
This useful little application allows you to define a custom json
schema, generate a "stream" of events and send to some output
destination, one of which is an IoT Hub. Unfortunately there was no
option to send directly to Event Hub, but this became a good excuse to
demonstrate some basic capabilities of Stream Analytics later. If you
want to follow along with this blog, [[download the latest tar
file]{.underline}](https://github.com/everwatchsolutions/json-data-generator/releases)
and use 7zip to extract the contents.

The generator requires two files to run, a config file and a workflow
file. For convenience you can download these both from my [[github
repository]{.underline}](https://github.com/hurtn/databricks/tree/master/streaming-etl)
and save them in the folder just below the jar named "conf". Open the
config file and you will notice it needs a connection string for IoT
Hub. Log into the Azure portal, create yourself a resource group or
create one when you provision an IoT Hub. Pick a region and use the same
region and resource group throughout.

Once the Iot Hub is ready, drop into the Explorers --- IoT Devices
section and add a device which the generator will assume. Give it a
name, click save, then click on the device and you see the connection
string needed for the config file.

![https://cdn-images-1.medium.com/max/1600/1\*1D-X5WmYqmPdwftxGEJtOQ.jpeg](media/image2.jpeg){width="6.268055555555556in"
height="3.4902777777777776in"}

If you have java installed, cd to the directory where you saved
extracted the jar (above) and run the following command:

java -jar json-data-generator-1.4.1.jar generatorConfig.json

If all is well you should see the generator logging message events...

![https://cdn-images-1.medium.com/max/1600/1\*F7xKd8zM2aK7ncCmM0CMow.png](media/image3.png){width="6.268055555555556in"
height="1.042361111111111in"}

and over in the metrics section of your IoT Hub you should see an
increase in telemetry messages sent...

![https://cdn-images-1.medium.com/max/1600/1\*0ey7OI3s0rRHPMrMslKh6A.png](media/image4.png){width="6.268055555555556in"
height="3.6666666666666665in"}

Shut down the event generator for now and let's continue with the set
up. Next we'll need an [[Event
Hub]{.underline}](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-about)
and a Cosmos DB instance before we we wire up a Stream Analytics job.

First [[create the event hub
namespace]{.underline}](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create)
(remember to use the same resource group) which is essentially a
container for one or more event hubs. Here you define the pricing tier
and throughput units.

![https://cdn-images-1.medium.com/max/1600/1\*7FI2Kg1evB5Yc4XFSwFfOg.png](media/image5.png){width="6.268055555555556in"
height="5.302777777777778in"}

Once the resource is ready, add a new event hub, give it a name and
click create. Once the event hub has created, click into it, choose
Shared Access Policies and add an policy for Databricks, so that it will
be able to read from the stream. Make note of the connection string key
as you'll need this later:

![https://cdn-images-1.medium.com/max/1600/1\*eAPPHKdssLQZLih-TRT9bw.png](media/image6.png){width="6.268055555555556in"
height="4.044444444444444in"}

Next, add a new Cosmos DB. You start by creating a Cosmos DB account
using the SQL API as this is currently the only [[supported
configuration]{.underline}](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-documentdb-output)
with Stream Analytics.

![https://cdn-images-1.medium.com/max/1600/1\*ctBsa63VnJeuo\_mF8iYXaA.png](media/image7.png){width="6.268055555555556in"
height="2.81875in"}

Under Collections --- Browse, add a new collection with the following
settings:

![https://cdn-images-1.medium.com/max/1600/1\*bQkQ6VqUF\_hC21\_HKtXXVQ.png](media/image8.png){width="6.268055555555556in"
height="3.345833333333333in"}

Now we're ready to configure the Stream Analytics which will read from
Iot Hub as an input source, parse the messages and route the message to
one of the above outputs, depending on the Entity Type field within each
message.

![https://cdn-images-1.medium.com/max/1600/1\*Tz7ppoU2TCr7yUfvURxXDg.png](media/image9.png){width="6.268055555555556in"
height="3.345833333333333in"}

Click into the inputs blade, and add a new input from Iot Hub and give
it an alias. Everything else should be pre-configured already for you.
Take note that Stream Analytics can [[parse json, csv and
avro]{.underline}](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-parsing-json).

Fun fact: Stream Analytics can support joins with two or more input
sources, including
[[lookups]{.underline}](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-use-reference-data)
against reference data! The reference data should be slowly changing in
nature and must reside in blob and must be a maximum size of 300 MB!

Next, click on the ouputs section and create one output sink for Event
Hub, and another for Cosmos DB. Give each of the outputs an alias, all
the other details should be pre-configured, except for the collection
name and document ID. Entering the document ID ensures that Stream
Analytics won't create duplicates, but instead will [[perform an
upsert]{.underline}](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-documentdb-output#upserts-from-stream-analytics).
Then enter the query blade and write a similar query to that shown below
to send the Adverts to Cosmos DB and the Impressions to Event Hub.

SELECT \*\
INTO \"output-cdb\"\
FROM \"input-iothub\"\
WHERE EntityType=\'Adverts\'

SELECT \*\
INTO \"output-evhub\"\
FROM \"input-iothub\"\
WHERE EntityType=\'Impressions\'

![https://cdn-images-1.medium.com/max/1600/1\*Bk7Dh8gNuJNut\_GWmJyteQ.png](media/image10.png){width="6.03125in"
height="3.65625in"}

Click Save. If you query is valid, you should be able to click back to
the Overview panel and start the job. Start up the data generator again
and watch the monitoring chart in the Stream Analytics overview panel
update after a short while...

![https://cdn-images-1.medium.com/max/1600/1\*4L2cfm7acofq5hBxxpT9wg.png](media/image11.png){width="6.268055555555556in"
height="4.097916666666666in"}

Verify you can see some data in the Data Explorer section of your Cosmos
DB and in the message metrics of your Event Hub namespace. If everything
is working stop the data generator and your stream analytics job and
let's finish the final data source, Azure SQL DB. Create this resource,
specify a blank database, add a new server and drop down to the basic
pricing tier for this demo.

In the SQL Database resource, open the Query Editor and run [[this
script]{.underline}](https://github.com/hurtn/databricks-delta/blob/master/insert-dummy-rows.sql)
to populate a small table of domains.

Then, create an Azure blob storage container so that we can can [[create
a mount point with
DBFS]{.underline}](https://docs.databricks.com/spark/latest/data-sources/azure/azure-storage.html).

![https://cdn-images-1.medium.com/max/1600/1\*ycwdZhRyeOzmsvQtZSXoDg.png](media/image12.png){width="6.268055555555556in"
height="2.8722222222222222in"}

Scroll down to blobs and create a container. Then head over to Access
Keys and make note of your secret keys.

Next, let's create our Azure Data Warehouse where we'll stream our data
in to once it's been transformed into a star schema. Note, to keep the
costs down for this demo I've chosen Gen1 and reduced and scaled it down
to 100 DWU. To also save on costs **you should pause it until you're
ready to start writing into it!**

![https://cdn-images-1.medium.com/max/1600/1\*u\_cPYWyfFStsu5VeM3qAjQ.png](media/image13.png){width="6.268055555555556in"
height="4.278472222222222in"}

Once that's created you need to create the master key, so click on Open
in Visual Studio,

[[https://docs.databricks.com/spark/latest/data-sources/azure/sql-data-warehouse.html\#sqldw]{.underline}](https://docs.databricks.com/spark/latest/data-sources/azure/sql-data-warehouse.html#sqldw)

Lastly, let's create our Databricks workspace. We need a premium
workspace to use Delta, but can take advantage of the 14 day trial
option. Note you are only billed for the time your cluster is running,
and you can use the [[pricing
calculator]{.underline}](https://azure.microsoft.com/en-gb/pricing/calculator/?service=databricks)
to get an idea of costs. Essentially though you're paying for the
underyling VMs (which are provisioned in an automatically created
resource group) and DBUs which are processing units per hour. If you
take the free trial, you will only pay for the VMs. There are two other
aspects to pricing which require some explanation...

In the pricing calculator there are two different workload types: [[Data
Analytics and Data
Engineering]{.underline}](https://azure.microsoft.com/en-gb/pricing/details/databricks/).
Data Engineering workloads are cheaper purely because these are your
(scheduled) production jobs which don't require the interactive
notebooks experience. The billing will automatically be adjusted
depending what type of workload you're running.

The other feature which determines price is the [[cluster
mode]{.underline}](https://docs.azuredatabricks.net/user-guide/clusters/high-concurrency.html).
High concurrency is more expensive than standard because (by my
understanding) it optimises resource utilization for
multi-user/concurrent query scenarios. For our purposes standard is
going to be fine.

![https://cdn-images-1.medium.com/max/1600/1\*iDT2VSRMrQkaqG2NC-Q-zg.png](media/image14.png){width="6.268055555555556in"
height="3.56875in"}

Once it's provisioned, click Launch Workspace. This takes you to 

If you're new to Databricks, Spark, or notebooks, (like I was a few
months ago) check out the [[Getting Started
Guide]{.underline}](https://docs.azuredatabricks.net/getting-started/index.html),
[[LinkedIn
Learning]{.underline}](https://www.linkedin.com/learning/azure-databricks-essential-training/)
or [[Databricks Academy]{.underline}](https://academy.databricks.com/)
which I can highly recommend.
