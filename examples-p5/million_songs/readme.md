# Song Triangles
### Data source
[The Million Songs Dataset](http://labrosa.ee.columbia.edu/millionsong/) contains data for a million songs from The Echo Nest, including title and artist, duration, maximum volume, tempo, &c.

The [full dataset](http://labrosa.ee.columbia.edu/millionsong/pages/getting-dataset) is massive, at 300 GB, but there is a much more manageable subset of 10,000 songs available [here](http://static.echonest.com/millionsongsubset_full.tar.gz).

Unfortunately, both datasets are in a format that's not friendly to p5js. However...

### Tools to convert the data
Tools are available [here](https://github.com/rcrdclub/mm-songs-db-tools) to convert the dataset to CSV format, which plays much more nicely with p5js. Instructions for running the script are available at the download link. It will require installing PyTables for Python and running just one command-line command.

### Managing the subset
Even the subset is really massive, so you will likely want to pull it into Excel, or a free alternative like [LibreOffice](http://www.libreoffice.org/) to manually cut/copy the lines you want, or delete unnecessary columns.

### Loading the data
If all went well, you should be able to load your data into p5js using the loadTable method and Table object.