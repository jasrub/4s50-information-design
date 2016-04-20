# Marvel Social Graph
### Data source
The full data set is linked through the [Amazon free data sets](https://aws.amazon.com/datasets/marvel-universe-social-graph/), but it's 1GB, which is a bit large for a test sketch. I found a CSV file from [Expose Data](http://exposedata.com/marvel/), which I believe is a smaller cleaned up subset of the full data. This smaller file was good enough to get up and running, and a much more manageable size.

### Data processing
No special data processing was required. The file format and size are suitable to flow into p5js as-is with the Table object and loadTable method. Note, however, the data format is just a list of character names in the left column, with their collaborators in the right column, and each partnership gets one row. So I had to iterate through each row, keeping a running tally to get a total count for each character (see code).