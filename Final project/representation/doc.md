### Jasmin Rubinovitz  
4/21/2016  
4s50 Information Design  
 

<div style="margin: auto; width: 90%; text-align:center" >
# Final Project  - Representations

## Sketches


<img src="sketches/sketch3.jpg"  style="width:27%">
<img src="sketches/sketch2.jpg"  style="width:27%">
<img src="sketches/sketch1.jpg"  style="width:27%">


## code  
showing the top entities, text size mapped to number of mentions  
![](screenshots/0_super_glue_data.png)  


cross referencing 2 data sources in order to find connections. The matrix doesn't make much sense   
![](screenshots/2_matrix.png) ![](screenshots/4_matrix.png)  

 
  
  

Using just super-glue data. a square is colored if 2 entities were mentioned in the same sentence in the closed captions   
![](screenshots/5_matrix.png) ![](screenshots/6_matrix.png) ![](screenshots/7_matrix.png)  
    

![](screenshots/14_matrix.png)
  
Plotting the network in another way    
![](screenshots/12_text_network.png)  

 
  
text size shows the number of mentions. color of the lines matched the number of mentions together.  
![](screenshots/13_text_network.png)  



Moving to circles. the location is determined using PCA on the adjacency matrix.   
![](screenshots/14_bubbles.png)  

![](screenshots/17_bubbles_svd.png)  

![](screenshots/16_bubbles_svd.png)  

Trying the d3.js circles packing algorithm for circles locations   
![](screenshots/22_d3_circles.png)  

 


### More Ideation:  

For the final version. I want to show how the connections and sizes of entities change across time.  
When hovering on a circle, the related circles will highlight. Then, clicking on any of the highlighted circles will show a relevant video bit that talks about these 2 entities  

![](sketches/VideoWordCloud.jpg)  

![](sketches/VideoWordCloud_1.jpg)  

![](sketches/VideoWordCloud_2.jpg)
</div>