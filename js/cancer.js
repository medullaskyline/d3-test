
d3.tsv("../clinMut_10054_56_02.tsv")
    .header("Content-Type", "application/json")
    .get(function(error, data){
      cancer.mutation_array_data = data;        
      do_everything();
    });


race_category_data = 
[
  {
    "label":"American Indian or Alaska Native",
    "data_label": "AMERICAN_INDIAN_OR_ALASKA_NATIVE",
    // "total":921605000, //
    // "num_children":26, //
    "short_label":"Native American" //
  },
  {
    "label":"Asian",
    "data_label": "ASIAN",
    // "total":921605000, //
    // "num_children":26, //
    "short_label":"Asian" //
  },
  {
    "label":"Black or African American",
    "data_label": "BLACK_OR_AFRICAN_AMERICAN",
    // "total":921605000, //
    // "num_children":26, //
    "short_label":"Black" //
  },
  {
    "label":"Native Hawaiian or Other Pacific Islander",
    "data_label": "NATIVE_HAWAIIAN_OR_OTHER_PACIFIC_ISLANDER",
    // "total":921605000, //
    // "num_children":26, //
    "short_label":"Pacific Islander" //
  },
  {
    "label":"White",
    "data_label": "WHITE",
    // "total":921605000, //
    // "num_children":26, //
    "short_label":"White" //
  },
  {
    "label":"Unknown or Other",
    "data_label": "NA",
    // "total":921605000, //
    // "num_children":26, //
    "short_label":"Unknown or Other" //
  },
];

country_category_data =
[
  {
    "label": "United States",
    "data_label": "United_States"
  },
  {
    "label": "Unknown",
    "data_label": "NA"
  },
  {
    "label": "Russia",
    "data_label": "Russia"
  },
  {
    "label": "Vietnam",
    "data_label": "Vietnam"
  },
  {
    "label": "Ukraine",
    "data_label": "Ukraine"
  },
  {
    "label": "Germany",
    "data_label": "Germany"
  },
  {
    "label": "Poland",
    "data_label": "Poland"
  },
  {
    "label": "Australia",
    "data_label": "Australia"
  },
  {
    "label": "Canada",
    "data_label": "Canada"
  },
  {
    "label": "Brazil",
    "data_label": "Brazil"
  },
  {
    "label": "Czech Republic",
    "data_label": "Czech_Republic"
  },
  {
    "label": "South Korea",
    "data_label": "Korea_South"
  },
  {
    "label": "Romania",
    "data_label": "Romania"
  },
  {
    "label": "Nigeria",
    "data_label": "Nigeria"
  },
  {
    "label": "United Kingdom",
    "data_label": "United_Kingdom"
  },
  {
    "label": "Israel",
    "data_label": "Israel"
  },
  {
    "label": "France",
    "data_label": "France"
  },
  {
    "label": "Singapore",
    "data_label": "Singapore"
  },
  {
    "label": "Netherlands",
    "data_label": "Netherlands"
  },
  {
    "label": "Italy",
    "data_label": "Italy"
  },
  {
    "label": "Moldova",
    "data_label": "Moldova"
  },
  {
    "label": "Afghanistan",
    "data_label": "Afghanistan"
  },
  {
    "label": "Puerto Rico",
    "data_label": "Puerto_Rico"
  },
  {
    "label": "Pakistan",
    "data_label": "Pakistan"
  },
  {
    "label": "Spain",
    "data_label": "Spain"
  },
  {
    "label": "Yemen",
    "data_label": "Yemen"
  },
  {
    "label": "Switzerland",
    "data_label": "Switzerland"
  }
];



/********************************
 ** FILE: chart.js
 ********************************/

var cancer = cancer || {};

cancer.Chart = function(){

  return {
    $j : jQuery,
    //defaults
    width           : 970,
    height          : 850,
    groupPadding    : 10,
    // totalValue      : 3700000000, // this is calculated below, after data
    // deficitValue    : 901000000,
    // CONST
    // MANDATORY       : "Mandatory",
    // DISCRETIONARY   : "Discretionary",
    // NET_INTEREST    : "Net interest",
    
    //will be calculated later
    boundingRadius  : null,
    maxRadius       : null,
    centerX         : null,
    centerY         : null,
    scatterPlotY    : null,
        
    //d3 settings
    defaultGravity  : 0.1,
    defaultCharge   : function(d){
                        if (d.value < 0) {
                          return 0
                        } else {
                          return -Math.pow(d.radius,2.0)/8 
                        };
                      },
    links           : [],
    nodes           : [],
    positiveNodes   : [],
    force           : {},
    svg             : {},
    circle          : {},
    gravity         : null,
    charge          : null,
    changeTickValues: [-0.25, -0.15, -0.05, 0.05, 0.15, 0.25], 
    ageTickValues: [20, 30, 40, 50, 60, 70, 80],
    categorizeChange: function(c){ // formerly 2012-2013 , now age at diagnosis
                        if (isNaN(c)) { return 0;
                        } else if ( c < -0.25) { return -3;
                        } else if ( c < -0.05){ return -2;
                        } else if ( c < -0.001){ return -1;
                        } else if ( c <= 0.001){ return 0;
                        } else if ( c <= 0.05){ return 1;
                        } else if ( c <= 0.25){ return 2;
                        } else { return 3; }
                      },
    categorizeAge: function(c){ // formerly 2012-2013 change, now age at diagnosis
                        if (isNaN(c)) { return 0;
                        } else if ( c <= 20) { return 1;
                        } else if ( c <= 30){ return 2;
                        } else if ( c <= 40){ return 3;
                        } else if ( c <= 50){ return 4;
                        } else if ( c <= 60){ return 5;
                        } else if ( c <= 70){ return 6;
                        } else if ( c <= 80){ return 7;
                        } else { return 8; }
                      },
    fillColor       : d3.scale.ordinal().domain([-3,-2,-1,0,1,2,3]).range(["#d84b2a", "#ee9586","#e4b7b2","#AAA","#beccae", "#9caf84", "#7aa25c"]),
    strokeColor     : d3.scale.ordinal().domain([-3,-2,-1,0,1,2,3]).range(["#c72d0a", "#e67761","#d9a097","#999","#a7bb8f", "#7e965d", "#5a8731"]),
    fillColorAge    : d3.scale.ordinal().domain([8,7,6,5,4,3,2,1]).range(["#19022a", "#43013a", "#5f0046", "#9e002f", "#ce1129", "#f6441a", "#f68617", "#ffa61e"]),
    strokeColorAge  : d3.scale.ordinal().domain([8,7,6,5,4,3,2,1]).range(["#19022a", "#43013a", "#5f0046", "#9e002f", "#ce1129", "#f6441a", "#f68617", "#ffa61e"]),
    
    getFillColor    : null,
    getStrokeColor  : null,
    pFormat         : d3.format("+.1%"), // not necessary for cancer?
    pctFormat       : function(){return false}, // not necessary for cancer?
    tickChangeFormat: d3.format("+%"), // not necessary for cancer
    simpleFormat    : d3.format(","), // not necessary for cancer?
    simpleDecimal   : d3.format(",.2f"),

    bigFormat       : function(n){return cancer.formatNumber(n*1000)}, // not necessary for cancer
    nameFormat      : function(n){return n},
    discretionFormat: function(d){ // not necessary for cancer
                        if (d == 'Discretionary' || d == 'Mandatory') {
                          return d + " spending"
                        } else {return d}
                      },  
    
    rScale          : d3.scale.pow().exponent(0.5).domain([0,3600]).range([1,90]),
    radiusScale     : null,
    changeScale     : d3.scale.linear().domain([-0.28,0.28]).range([620,180]).clamp(true),
    sizeScale       : d3.scale.linear().domain([0,110]).range([0,1]),
    groupScale      : {},

    rTumorSizeScale : d3.scale.pow().exponent(0.5).domain([0,3600]).range([1,90]), // 3600 is max tumor size -- consider linear scale?


    
    //data settings
    // currentYearDataColumn   : 'budget_2013',
    // previousYearDataColumn  : 'budget_2012',
    // possibly change this to look up column headers in tsv file
    tumorWeightDataColumn   : 'N:SAMP:tumor_weight:::::',
    raceDataColumn          : 'C:CLIN:race:::::',
    countryDataColumn       : 'C:CLIN:country:::::', 
    genderDataColumn        : 'C:CLIN:gender:::::',
    ageDataColumn           : 'N:CLIN:age_at_initial_pathologic_diagnosis:::::',
    barcodeDataColumn       : 'M:CLIN+SAMP+GNAB',
    histologicalColumn      : 'C:CLIN:histological_type:::::',
    data                    : cancer.mutation_array_data.filter(function(e){return e['M:CLIN+SAMP+GNAB'] === 'TCGA-CF-A1HS-01'}),//{ return e['C:CLIN:disease_code:::::'] === 'BLCA'}), // custom filter later
    categoryPositionLookup  : {},
    categoriesList          : [],
    
    // 
    // 
    // 
    init: function() {
      var that = this;
      
      this.scatterPlotY = this.changeScale(0);
      
      this.pctFormat = function(p){
        if (p === Infinity ||p === -Infinity) {
          return "N.A."
        } else {
          return that.pFormat(p)
        }       
      }
      
      this.radiusScale = function(n){
        n = parseFloat(n);
        if (!parseFloat(n)){
          n = 1;
        }
        return that.rScale(Math.abs(n)); 
      };
      this.getStrokeColor = function(d){
        return that.strokeColorAge(d.ageCategory);
      };
      this.getFillColor = function(d){
        return that.fillColorAge(d.ageCategory);
      };
      
      this.boundingRadius = this.radiusScale(this.totalValue);
      this.centerX = this.width / 2;
      this.centerY = 300;
      
      // category_data.sort(function(a, b){  // category_data
      //   return b['total'] - a['total'];  
      // });

      //calculates positions of the country category clumps
      //it is probably overly complicated
      // [fill this in later]

      // Builds the nodes data array from the original data
      for (var i=0; i < this.data.length; i++) {
        var n = this.data[i];
        var out = {
          sid: n[this.barcodeDataColumn],
          radius: this.radiusScale(n[this.tumorWeightDataColumn]),
          group: n[this.countryDataColumn],
          // change: n['change'],
          ageCategory: this.categorizeAge(n[this.ageDataColumn]),
          value: n[this.tumorWeightDataColumn],
          name: n[this.histologicalColumn].replace(/_/g, ' '),
          gender: n[this.genderDataColumn],
          // isNegative: (n[this.currentYearDataColumn] < 0),
          // positions: n.positions,
          x:Math.random() * that.width,
          y:Math.random() * that.height
        }
        // if (n.positions.total) {
        //   out.x = n.positions.total.x + (n.positions.total.x - (that.width / 2)) * 0.5; // 'that' is the chart
        //   out.y = n.positions.total.y + (n.positions.total.y - (150)) * 0.5;
        // };
        // if ((n[this.currentYearDataColumn] > 0)!==(n[this.previousYearDataColumn] > 0)) {
        //   out.change = "N.A.";
        //   out.changeCategory = 0;
        // };
        this.nodes.push(out)
      };
      
      // sorts by tumor weight -- not used
      // this.nodes.sort(function(a, b){  
      //   return Math.abs(b.value) - Math.abs(a.value);  
      // });
      
      // this initially was meant to distinguish net income from net spending
      // possibly push nodes onto 8 arrays of age ranges
      // for (var i=0; i < this.nodes.length; i++) {
      //   if(!this.nodes[i].isNegative ){
      //     this.positiveNodes.push(this.nodes[i])
      //   }
      // };

      this.svg = d3.select("#cancer-chartCanvas").append("svg:svg")
        .attr("width", this.width);
      
        for (var i=0; i < this.changeTickValues.length; i++) {
          d3.select("#cancer-discretionaryOverlay").append("div")
            .html("<p>"+this.tickChangeFormat(this.changeTickValues[i])+"</p>")
            .style("top", this.changeScale(this.changeTickValues[i])+'px')
            .classed('cancer-discretionaryTick', true)
            .classed('cancer-discretionaryZeroTick', (this.changeTickValues[i] === 0) )
        };
        d3.select("#cancer-discretionaryOverlay").append("div")
          .html("<p></p>")
          .style("top", this.changeScale(0)+'px')
          .classed('cancer-discretionaryTick', true)
          .classed('cancer-discretionaryZeroTick', true)
        d3.select("#cancer-discretionaryOverlay").append("div")
          .html("<p>+26% or higher</p>")
          .style("top", this.changeScale(100)+'px')
          .classed('cancer-discretionaryTickLabel', true)
        d3.select("#cancer-discretionaryOverlay").append("div")
          .html("<p>&minus;26% or lower</p>")
          .style("top", this.changeScale(-100)+'px')
          .classed('cancer-discretionaryTickLabel', true)

      // // deficit circle 
      // d3.select("#cancer-deficitCircle").append("circle")
      //   .attr('r', this.radiusScale(1000))
      //   .attr('class',"cancer-deficitCircle")
      //   .attr('cx', 125)
      //   .attr('cy', 125);
        
      // -- all this redundant?
      // d3.select("#nytg-scaleKey").append("circle")
      //   .attr('r', this.radiusScale(100000000))
      //   .attr('class',"nytg-scaleKeyCircle")
      //   .attr('cx', 30)
      //   .attr('cy', 30);
      // d3.select("#nytg-scaleKey").append("circle")
      //   .attr('r', this.radiusScale(10000000))
      //   .attr('class',"nytg-scaleKeyCircle")
      //   .attr('cx', 30)
      //   .attr('cy', 50);
      // d3.select("#nytg-scaleKey").append("circle")
      //   .attr('r', this.radiusScale(1000000))
      //   .attr('class',"nytg-scaleKeyCircle")
      //   .attr('cx', 30)
      //   .attr('cy', 55);

      // department will change to country
      var departmentOverlay = $j("#cancer-departmentOverlay")
      
      for (var i=0; i < country_category_data.length; i++) {
        // var cat = cancer.country_category_data[i]['label']
        // // var catLabel = cancer.country_category_data[i]['short_label']
        // // var catTot = this.bigFormat(cancer.country_category_data[i]['total'])
        // var catWidth = this.categoryPositionLookup[cat].w
        // var catYOffset = this.categoryPositionLookup[cat].offsetY;
        // var catNode;
        // if (cat === "Other") {
        //   catNode = $j("<div class='cancer-departmentAnnotation cancer-row"+cancer.country_category_data[i]['row']+"'><p class='department'>"+cat+"</p></div>")
          
        // } else {
        //   catNode = $j("<div class='cancer-departmentAnnotation cancer-row"+country_cancer.category_data[i]['row']+"'><p class='total'>$"+catTot+"</p><p class='department'>"+catLabel+"</p></div>")
          
        // }
        //   catNode.css({'left':this.categoryPositionLookup[cat].x-catWidth/2,'top': this.categoryPositionLookup[cat].y - catYOffset, 'width':catWidth})
        // departmentOverlay.append(catNode)
      
      };

      // This is the every circle
      this.circle = this.svg.selectAll("circle")
          .data(this.nodes, function(d) { return d.sid; });

      this.circle.enter().append("svg:circle")
        .attr("r", function(d) { return 0; } )
        .style("fill", function(d) { return that.getFillColor(d); } )
        .style("stroke-width", 1)
        .attr('id',function(d){ return 'cancer-circle'+d.sid })
        .style("stroke", function(d){ return that.getStrokeColor(d); })
        .on("mouseover",function(d,i) { 
          // var el = d3.select(this)
          // var xpos = Number(el.attr('cx'))
          // var ypos = (el.attr('cy') - d.radius - 10)
          // el.style("stroke","#000").style("stroke-width",3);
          // d3.select("#cancer-tooltip").style('top',ypos+"px").style('left',xpos+"px").style('display','block')
          //   .classed('cancer-plus', (d.changeCategory > 0))
          //   .classed('cancer-minus', (d.changeCategory < 0));
          // d3.select("#cancer-tooltip .cancer-name").html(that.nameFormat(d.name))

          // // change from d.discretion to d.ageCategory
          // d3.select("#cancer-tooltip .cancer-discretion").text(that.discretionFormat(d.ageCategory))
          // d3.select("#cancer-tooltip .cancer-department").text(d.group)
          // d3.select("#cancer-tooltip .cancer-value").html("$"+that.bigFormat(d.value))
          
          // var pctchngout = that.pctFormat(d.change)
          // if (d.change == "N.A.") {
          //   pctchngout = "N.A."
          // };
          // d3.select("#cancer-tooltip .cancer-change").html(pctchngout) 
        })
        .on("mouseout",function(d,i) { 
          // d3.select(this)
          // .style("stroke-width",1)
          // .style("stroke", function(d){ return that.getStrokeColor(d); })
          // d3.select("#cancer-tooltip").style('display','none')
        });
      
            
      this.circle.transition().duration(2000).attr("r", function(d){return d.radius})


    }, // end init

    start: function() {
      var that = this;

      this.force = d3.layout.force()
        .nodes(this.nodes)
        .size([this.width, this.height])     
      // this.circle.call(this.force.drag)
    },

    totalLayout: function() {
      var that = this;
      this.force
        .gravity(-0.01)
        .charge(that.defaultCharge)
        .friction(0.9)
        .on("tick", function(e){
          that.circle
          //   .each(that.totalSort(e.alpha))
          //   .each(that.buoyancy(e.alpha))
            .attr("cx", function(d) { 
              // console.log('d.x is ' + d.x);
              return d.x; 
            })
            .attr("cy", function(d) { 
              // console.log('d.y is ' + d.y);
              return d.y; 
            });
        })
        .start();
      
    },

    // ----------------------------------------------------------------------------------------
    // FORCES
    // ----------------------------------------------------------------------------------------
    
    // 
    // 
    // 
    // 
    totalSort: function(alpha) {
      var that = this;
      return function(d){
        var targetY = that.centerY;
        var targetX = that.width / 2;
             
        d.y = d.y + (targetY - d.y) * (that.defaultGravity + 0.02) * alpha
        d.x = d.x + (targetX - d.x) * (that.defaultGravity + 0.02) * alpha
        
      };
    },

    // 
    // 
    // 
    buoyancy: function(alpha) {
      var that = this;
      return function(d){              
          var targetY = that.centerY - (d.changeCategory / 3) * that.boundingRadius
          d.y = d.y + (targetY - d.y) * (that.defaultGravity) * alpha * alpha * alpha * 100                         
      };
    }

  } // end return
  console.log('at end of returned Chart object');
} // end Chart object





/********************************
 ** FILE: ChooseList.js
 ********************************/

// var nytg = nytg || {};
// var $j = jQuery;

cancer.ChooseList = function(node, changeCallback) {
  this.container = $j(node);
  this.selectedNode = null;
  this.currentIndex = null;
  this.onChange = changeCallback;
  this.elements = this.container.find('li');
  this.container.find('li').on('click',$j.proxy(this.onClickHandler, this));
  this.selectByIndex(0);
};

cancer.ChooseList.prototype.onClickHandler = function(evt) {
  evt.preventDefault();
  this.selectByElement(evt.currentTarget);
};


cancer.ChooseList.prototype.selectByIndex = function(i) {
  this.selectByElement(this.elements[i])
};


cancer.ChooseList.prototype.selectByElement = function(el) {
  if (this.selectedNode) {
    $j(this.selectedNode).removeClass("selected");
  };
  $j(el).addClass("selected");
  for (var i=0; i < this.elements.length; i++) {
    if (this.elements[i] === el) {
      this.currentIndex = i;
    }
  };
  this.selectedNode = el;
  this.onChange(this);
};