var parameters =[];
var importance = {'vh':[0.8,0.9,1],'h':[0.5,0.7,0.85],'m':[0.25,0.4,0.6],'l':[0.1,0.2,0.3],'vl':[0,0.1,0.15]};
var impact = {'vh':[7.5,8.5,10],'h':[5,6.5,8],'m':[3,4.5,6],'l':[1.5,2.5,3.5],'vl':[0,1,2]};
var all_importance=[];
var all_impact = [];
var numexpert =0;

var hold =[];
var interm=[];
var mult=[];

var rank=[];
var aur={};
//var quests=[];

//var all_question_product =[];

var ranktable = [];

var feasibility_importance =[];

var imp_sum=0;
var imp_sum2=0;
var imp_sum3=0;

var r_sum=0;
var r_sum2=0;
var r_sum3=0;

$(document).ready(
    function(){
        //Refresh page
        $(".refresh").click( function(){
            window.location.reload();
        });

        // Add Parameters
        $('#ent').click(
            function(){
                var a = $('#para').val();
                parameters.push(a);
                $('.parameter-list').append("<li>"+a+"<span class='del-para'>X [Delete]</span></li>");
                $('#para').val('');
            }
        );

        //Delete Parameters
        $(".parameter-list").on("click", ".del-para", function(){
             $(this).parent().remove();
            var x = $(this).parent().contents().filter(function() {
                return this.nodeType == 3; // text node
            });
            parameters.splice(parameters.indexOf(x.text()),1);

            //console.log(x.text());
        });  

        //submit parameters
        $("#submit-para").click(function(){
            numexpert = $('#experts').val();
            for (var y=0;y<numexpert;y++){
            $('.page-two').append(makepage(parameters,(y+1)));
            }

            $(".page-one").hide();
            $(".page-two").prepend("<h2> Kindly Input Your Answers </h2>");
           // $(".page-two").append("<button class='calculate'> Compute Solution </button>");
           $(".calculate").show();
        });

        //calculate values
        $(".calculate").on("click", function(){

            makevalues();
        });

        function makepage(array,expertnum){
        
           var start = "<div class='question expert-"+ expertnum+"'><h2 class='inside-heading'>Expert "+expertnum+"</h2><p>Rate the following Parameters:</p><ol class='q-list'>";
           var questions ="";
           var end = "</ol><button class='expb sub-"+expertnum+"'>SUBMIT</button></div></input>";

           for (var x=0;x<array.length;x++){
            var y="<li class='all-q'><span class='my-para'>"+array[x]+"</span><br><span class='input-box'><b>Importance:</b> &nbsp; Very High <input type='radio' name='importance-expert"+expertnum+"-"+x+"' value='vh'>&nbsp; High <input type='radio' name='importance-expert"+expertnum+"-"+x+"' value='h'>&nbsp; Medium <input type='radio' name='importance-expert"+expertnum+"-"+x+"' value='m'>&nbsp; Low <input type='radio' name='importance-expert"+expertnum+"-"+x+"' value='l'>&nbsp; Very Low <input type='radio' name='importance-expert"+expertnum+"-"+x+"' value='vl'></span><br><span class='input-box'><b>Impact:</b> &nbsp; Very High <input type='radio' name='impact-expert"+expertnum+"-"+x+"' value='vh'>&nbsp; High <input type='radio' name='impact-expert"+expertnum+"-"+x+"' value='h'>&nbsp; Medium <input type='radio' name='impact-expert"+expertnum+"-"+x+"' value='m'>&nbsp; Low <input type='radio' name='impact-expert"+expertnum+"-"+x+"' value='l'>&nbsp; Very Low <input type='radio' name='impact-expert"+expertnum+"-"+x+"' value='vl'></span></li>";

            questions+=y;
           }
           
           return start+questions+end;
        }

        function makevalues(){
            var a=[];
            var allex = numexpert;
            for( var i= 0; i<allex;i++){
                for(var j=0;j<parameters.length;j++){
                    var i1=  $("input[name='importance-expert"+(i+1)+"-"+j+"']:checked").val();
                    var i2= $("input[name='impact-expert"+(i+1)+"-"+j+"']:checked").val();
                    all_importance.push(importance[i1]);
                    all_impact.push(impact[i2]);
                }
              
            }

            //multiplication 
            for(var i=0; i<all_impact.length;i++){
                for(var j=0; j<all_impact[0].length;j++){
                    var a = all_impact[i][j]*all_importance[i][j];
                    mult.push(a);
                }
            }

            //sort products
            for(var x=0; x<mult.length;x++){
                interm.push(mult[x]);
                if(x!==0 && (x+1)%3===0 )
                {
                    hold.push(interm);
                    interm=[]; 
                }
             }

             //get aggregate weight of all questions
             for(var u=0;u<parameters.length;u++){
                var av=ranger(u,hold.length,parameters.length);
                var aqp =[];
                var sum=0;
                var sum2=0;
                var sum3=0;
                for(var v=0;v<av.length;v++){
                sum+=hold[av[v]][0];
                sum2+=hold[av[v]][1];
                sum3+=hold[av[v]][2];
                }
                ranktable.push([sum,sum2,sum3]);
                var sum=0;
                var sum2=0;
                var sum3=0;
                console.log(av);
            }

            //ranking
            for(var u=0;u<ranktable.length;u++){
                var r = (ranktable[u][0]+(4*ranktable[u][1])+ranktable[u][2])/6;
                rank.push(r);
            }

            // outputting ranking
            for( var y=0;y<rank.length;y++){
                var question = indexOfMax(rank);
                var jsonrank = "Question "+(question+1)+"["+parameters[question] +"]"+"(Rank "+(y+1)+")";
                aur[jsonrank]=rank[question];
                rank[question]=0;
            }

            $('button.calculate').hide();
            $('.solution-output').show();
            //final output
            for(x in aur){ 
                
                console.log(x+"->"+(Math.round((aur[x]*100))/100));
                $('.solution-output').append("<h3>"+x+"=>"+(Math.round((aur[x]*100))/100)+"</h3>");

            }

            //------for feasibility----------------//
            
            //all importance
            for(var w=0;w<all_importance.length;w++){
                imp_sum+=all_importance[w][0];
                imp_sum2+=all_importance[w][1];
                imp_sum3+=all_importance[w][2];
            }

            // all question rank table
            for(var x=0;x<ranktable.length;x++){
                r_sum+=ranktable[x][0];
                r_sum2+=ranktable[x][1];
                r_sum3+=ranktable[x][2];
            }

            //output feasibility
            console.log("Feasibility is ["+(r_sum/imp_sum)+","+(r_sum2/imp_sum2)+" , "+(r_sum3/imp_sum3)+"]");
            $('.solution-output').append("<h3>"+"Feasibility is ["+(Math.round((r_sum/imp_sum)*100)/100)+" , "+(Math.round((r_sum2/imp_sum2)*100)/100)+" , "+(Math.round((r_sum3/imp_sum3)*100)/100)+"]"+"</h3>");



             /*////////////////////////////////The is an Error Here///////////////////////////////////////questions
             for(var i=0;i<hold.lengt;i++)
                {
                 quests.push([hold[i][0]+hold[i+parameters.length][0],hold[i][1]+hold[i+parameters.length][1],hold[i][2]+hold[i+parameters.length][2]]);
                }  
               
                for(var i=0; i<numexpert;i++){
                    var u=0;
                    for(var j=0;j<3;j++){
                        u+=hold[i][j]+hold[i+parseInt(numexpert)][j]+hold[i+(2*parseInt(numexpert))][j];
                    console.log(u);
                    }
                    all_question_product.push(u);
                    u=0;
                }
            
                //ranking
                for(var u=0;u<quests.length;u++){
                    var r = (quests[u][0]+(4*quests[u][1])+quests[u][2])/6;
                    rank.push(r);
                }*/


            return 0;
        }

        function ranger(start,end,gap=1){
            var a=[];
            if (gap===0){
                console.log("Not Zero!");
            }
            else if(gap===1){
                for (var i=start;i<end;i++){
                        a.push(i);
                     }
                }
             else{
                for(var j=start;j<end;j+=gap){
                    a.push(j);
                }
             }
            return a;
        }

        function indexOfMax(arr){
            if(arr.length ==0){
                return -1;
            }
        
        var max = arr[0];
        var maxIndex =0;
        
        for (var i = 1; i<arr.length; i++){
            if(arr[i] > max){
                maxIndex = i;
                max = arr[i];
            }
        }
        
        return maxIndex;}
    }
);