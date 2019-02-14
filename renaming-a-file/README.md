::: {#static-notebook data-reactroot=""}
::: {#tooltip .hidden}
[]{#value}
:::

::: {#topbar}
::: {.tb-logo}
[![databricks-logo](./RenameFileAfterWriteDatabricks_files/databricks_logoTM_rgb_TM.39f53bf0.svg)](http://databricks.com/ "Databricks")
:::

::: {.tb-title-wrapper .tb-title-wrapper-central}
[RenameFileAfterWrite]{.tb-title}[(Python)]{.tb-title-lang}
:::

::: {.tb-import}
[ Import Notebook]{.btn .btn-default .import-button}
:::
:::

::: {#overallView}
::: {#content}
::: {.overallContainer}
::: {.shell-top .new-notebook .no-edit .no-run .static-notebook}
![](./RenameFileAfterWriteDatabricks_files/spinner.7eb0071e.svg){.load-spinner}

::: {.heading-command-wrapper}
::: {.command .divider}
[]{.btn .btn-default .btn-circle .insert-command-btn}[]{.btn
.btn-default .btn-circle .paste-command-btn .hidden}
:::
:::

::: {.heading-command-wrapper}
::: {.heading-toggler}
:::

::: {.new-notebook .command .mainCommand .no-edit .no-run .command-finished .cellIndex-0 .cell-662058925165460-662058925165461}
::: {.command-comments-wrapper}
:::

[]{.move-command-btn}

::: {.command-input .previousPrompt}
::: {.command-text .command-text-finished}
::: {.command-box .wrappable}
``` {.cm-s-eclipse .capture-run-mode}
# clear existing files
dbutils.fs.rm("/tmp/singlecsv",True)

# read in a data frame
deltaDF = spark.read \
  .format("delta")  \
  .load("/mnt/databricks/fact/impressions")
# write dataframe as one file
writeCSV = deltaDF.repartition(1).write.format("csv").save("/tmp/singlecsv")
# list contents
display(dbutils.fs.ls("/tmp/singlecsv"))
```
:::
:::
:::

::: {.results-and-comments}
::: {.command-result-wrapper}
::: {.command-result}
::: {.spinner .command-stage-info}
:::

<div>

::: {.results .dashboard}
::: {.dashboard}
::: {style="width: auto; position: relative; margin-top: 0px;"}
<div>

::: {.widget .ui-resizable data-guid="808f920f-8293-435b-a1d4-d5c8f1d3af34" style="left: 0px; top: 0px; width: auto; height: auto;"}
::: {.ui-resizable-handle .ui-resizable-se .ui-icon .ui-icon-gripsmall-diagonal-se style="z-index: 90; display: block;"}
:::

::: {.widget-content .dashboard}
::: {.results}
::: {.results-table .noscroll tabindex="-1"}
::: {.floatThead-wrapper style="position: relative; clear:both;"}
::: {.inner}
:::
:::
:::
:::
:::
:::

</div>
:::
:::
:::

</div>
:::
:::
:::
:::
:::
:::
:::
:::
:::
:::

dbfs:/tmp/singlecsv/\_SUCCESS

\_SUCCESS

0

dbfs:/tmp/singlecsv/\_committed\_5275721253680856832

\_committed\_5275721253680856832

112

dbfs:/tmp/singlecsv/\_started\_5275721253680856832

\_started\_5275721253680856832

0

dbfs:/tmp/singlecsv/part-00000-tid-5275721253680856832-896d31f2-b872-4078-bc1a-eba86e063501-1388-c000.csv

part-00000-tid-5275721253680856832-896d31f2-b872-4078-bc1a-eba86e063501-1388-c000.csv

7316778

::: {.floatThead-floatContainer .floatThead-container style="overflow: hidden; position: absolute; margin-top: 0px; top: 0px; z-index: 1; left: 0px; width: 1423px;" aria-hidden="true"}
  path   name   size
  ------ ------ ------
:::

::: {.download-controls}
[]{.btn .btn-small .results-download-preview}
:::

::: {.refresh-controls style="position: absolute; left: 0px; top: 0px; display: none;"}

------------------------------------------------------------------------

Last refresh: [Never]{.last-refresh}

Refresh now
:::

::: {.command-result-stats .hidden}
Command took 20.69 seconds
:::

::: {style="clear: both;"}
:::

::: {.heading-command-wrapper}
::: {.command .divider}
[]{.btn .btn-default .btn-circle .insert-command-btn}[]{.btn
.btn-default .btn-circle .paste-command-btn .hidden}
:::
:::

::: {.heading-command-wrapper}
::: {.heading-toggler}
:::

::: {.new-notebook .command .mainCommand .no-edit .no-run .command-finished .cellIndex-1 .cell-662058925165460-662058925165463}
::: {.command-comments-wrapper}
:::

[]{.move-command-btn}

::: {.command-input .previousPrompt .primaryPrompt}
::: {.command-text .command-text-finished}
::: {.command-box .wrappable}
``` {.cm-s-eclipse .capture-run-mode}
import datetime
readPath = "/tmp/singlecsv"
targetFName = "Kantar"+datetime.datetime.now().strftime("%Y%m%d")+".csv"
file_list = dbutils.fs.ls(readPath)
for i in file_list:
            if i[1].startswith("part-00000"): #### find your temp file name 
                 read_name = i[1]
                 print(read_name)
dbutils.fs.mv(readPath+"/"+read_name, readPath+"/"+targetFName)
// display the contents
display(dbutils.fs.ls(readPath))
```
:::
:::
:::

::: {.results-and-comments}
::: {.command-result-wrapper}
::: {.command-result}
::: {.spinner .command-stage-info}
:::

<div>

::: {.results .dashboard}
::: {.dashboard}
::: {style="width: auto; position: relative; margin-top: 0px;"}
<div>

::: {.widget .ui-resizable data-guid="03cdbc63-2fb4-44ef-a629-9345859a1461" style="left: 0px; top: 0px; width: auto; height: auto;"}
::: {.ui-resizable-handle .ui-resizable-se .ui-icon .ui-icon-gripsmall-diagonal-se style="z-index: 90; display: block;"}
:::

::: {.widget-content .dashboard}
::: {.results}
::: {.results-table .noscroll tabindex="-1"}
::: {.floatThead-wrapper style="position: relative; clear:both;"}
::: {.inner}
:::
:::
:::
:::
:::
:::

</div>
:::
:::
:::

</div>
:::
:::
:::
:::
:::

dbfs:/tmp/singlecsv/Kantar20190214.csv

Kantar20190214.csv

7316778

dbfs:/tmp/singlecsv/\_SUCCESS

\_SUCCESS

0

dbfs:/tmp/singlecsv/\_committed\_5275721253680856832

\_committed\_5275721253680856832

112

dbfs:/tmp/singlecsv/\_started\_5275721253680856832

\_started\_5275721253680856832

0

::: {.floatThead-floatContainer .floatThead-container style="overflow: hidden; position: absolute; margin-top: 0px; top: 0px; z-index: 1; left: 0px; width: 1423px;" aria-hidden="true"}
  path   name   size
  ------ ------ ------
:::

::: {.download-controls}
[]{.btn .btn-small .results-download-preview}
:::

::: {.refresh-controls style="position: absolute; left: 0px; top: 0px; display: none;"}

------------------------------------------------------------------------

Last refresh: [Never]{.last-refresh}

Refresh now
:::

::: {.command-result-stats .hidden}
Command took 1.62 seconds
:::

::: {style="clear: both;"}
:::

::: {.heading-command-wrapper}
::: {.command .divider}
[]{.btn .btn-default .btn-circle .insert-command-btn}[]{.btn
.btn-default .btn-circle .paste-command-btn .hidden}
:::
:::

::: {.contentSpacer style="height: 0px;"}
:::
