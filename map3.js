
d3.json('https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json')
  .then((featureCollection) => {
    drawMap(featureCollection);
  });

function drawMap(featureCollection) {
  const svg = d3.select('#prueba')
    .append('svg');

    // pimtamos el svg
  const width = 600;
  const height = 600;
  svg.attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(0, 0)')

    // declaramos variables
    const border =300
    const center = d3.geoCentroid(featureCollection);
    const projection = d3.geoMercator()
        // zoom que hago en el mapa
        //.scale(100000)
        .fitSize([width/2, height/2], featureCollection)
        // coordenadas de sol
        .center(center)
        //lo muevo al punto central de nuestro mapa
        .translate([width/2.5, height/3.5]);
    
        // el path es para pintar el mapa
    const pathProjection = d3.geoPath().projection(projection);

    const features = featureCollection.features;

    const groupMap = svg.append('g').attr('class', 'map');
    // me pinta los barrios. Lo metemos en un grupo
    const subunitsPath = svg.selectAll('.subunits')
        .data(features)
        .enter()
        .append('path')

subunitsPath.attr('d',(d) => {
    d.opacity = 1;
    return pathProjection(d);
  });


  ///////////////////////////////////

    //Añado el grafico de barras
const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .range([height, 0]);


x.domain(features.map(function(d) { return d.properties.name; }));
y.domain([0, d3.max(features, function(d) { return d.properties.avgprice; })]);

// creo un svg nuevo en el que se incluirá el gráfico
const svg2 = d3.select('#prueba')
.append('svg');
const width2 = 700;
  const height2 = 600;
  svg2.attr('width', width2)
    .attr('height', height2)
    .attr('transform', 'translate(0, -100)')

// añado los rectángulos al gráfico
svg2.selectAll(".bar")
.data(features)
.enter().append("rect")
.attr("class", "bar")
.attr("x", function(d) { return x(d.properties.name); })
.attr("width", x.bandwidth())
.attr("y", function(d) { return y(d.properties.avgprice); })
.attr("height", function(d) { return height2 - y(d.properties.avgprice); })
.attr('transform', 'translate(20, -50)');


// añado los ejes

const xAxis = d3.axisBottom(x);
const sizeAxisX = 20;
const groupAxisX = svg2.append('g');

// aqui lo transforma para que encaje 
groupAxisX
  .attr('transform', `translate(20, 550)`)
  .call(xAxis)
  .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );
const yAxis = d3.axisRight(y);

const groupAxisY = svg2.append('g');

groupAxisY
    .call(yAxis)
    .attr('transform', `translate(0, -50)`)


//////////////////////////////////

      
    // para crear la escala del mapa
    const colorScale = d3.scaleQuantize()
    .domain([0,100])
    .range(["#E3CEF6", "#BE81F7", "#9A2EFE", "#5F04B4"]); 

    const legend = d3.legendColor()
    .scale(colorScale)
    .labelFormat(d3.format(".0f"))
    .title("Rango de precios");

    svg.append("g") //ponerlo con variable
    .attr("transform", "translate(10,10)")
    .call(legend)

    subunitsPath.attr('fill', (d) => colorScale(d.properties.avgprice))
  
    const legend2 = svg.append('g').attr('class', 'legend');
} 




