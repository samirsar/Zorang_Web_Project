

/*Note
Access to fetch at 'https://zorang-recrutment.s3.ap-south-1.amazonaws.com/addresses.json' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.


   if this type of error occure please use "Moesif CORS" google chrome extension
*/
/*

Solution: Approacth to solve this proble

step1: first extract the data from api using  fetch api
step2: take the location of store as input and intialize all the location of agent with store location
step3: giving each agent at least one delivery location;
step4: intialize a time constraint to the keep track of each agents at every delivery location 
step5: assume time taken by a agents to delivery to next location equal to distance between two points
step5: after that Store the agents wit+h minimum delivery time at each delivery location using time variable

*/
console.log("Zorang Project");

// calculating distance between two location 
function distance(x_source,y_source,x_d,y_d)
{
    let dist=(x_source-x_d)*(x_source-x_d)+(y_source-y_d)*(y_source-y_d);
    return dist;
}

// which delivery location is near to agent from agent_current_location 
function min_dist(agent_current_location,data,visited)
{

    let x_source=agent_current_location.Latitude;
    let y_source=agent_current_location.Longitude;
    let n=data.length;
    let dist=[];
    for(let i=0;i<n;i++)
    {
        if(visited[i+1]==0){
        obj={
            id:data[i]._id,
            d:distance(x_source,y_source, data[i].latitude,data[i].longitude)
        }
        dist.push(obj);
    }
    
    }
    
    dist.sort((a,b)=>{
        return a.d-b.d;
    });
    return dist[0];

}
function solution(data)
{
    console.log("Addresses to deliver",data);// data ==location of addresses
    let n=data.length;
    let store_location={
        Latitude: 28.9428,
        Longitude:77.2276
    }
    console.log(store_location);// store location

  
    let agent_delivered=[];
    for(let i=0;i<10;i++)
    {
        agent_delivered.push([]);
    }
    console.log(agent_delivered,"agent_delivered");
    let visited=new Array(n+1);// initialize a visited array to keep the status of delivery location
    visited.fill(0);// initialize with zero initially

    let agent_current_location=[];
      // intitialy location of all agent will be equal to store_loaction
    for(let i=0;i<10;i++)
    {
        agent_current_location[i]={
            time:0,
            current_location:store_location
        }
    }
    
    //step3: giving each agent at least one delivery location;
    for(let i=0;i<10;i++)
    {
        let obj=min_dist(agent_current_location[i].current_location,data,visited);
        agent_delivered[i].push(obj.id);
        visited[obj.id]=1;
        let temp_obj={ Latitude: data[obj.id-1].latitude,Longitude:data[obj.id-1].longitude};
        agent_current_location[i].time+=obj.d;// time taken to delivery this point the agent i
        agent_current_location[i].current_location=temp_obj;// update the location of agent i
    }


    let count=10;// we have to deliver 10 order at present time

    // now we are giving one delivery which is nearest to any agents and increment agents time
    while(count<100)
    {
        let temp_arr=[];
        for(let i=0;i<10;i++)
        {

            let time=agent_current_location[i].time;
            let xs=agent_current_location[i].current_location.Latitude;
            let ys=agent_current_location[i].current_location.Longitude;
            for(let j=0;j<n;j++)
            {
                if(visited[j+1]==0)
                {
                    let xd=data[j].latitude;
                    let yd=data[j].longitude;
                    let temp_d=distance(xs,ys,xd,yd)+time;
                    let obj={
                        agent_id:i,
                        dest_id:j+1,
                        d:temp_d
                    }
                    temp_arr.push(obj);
                }
            }
        }

        // sorting temp_arr according to their distance
        temp_arr.sort((a,b)=>{
            return a.d-b.d;
        })
        let obj=temp_arr[0];
        
        // pushing delivery location id to respective agent from where it's distance is minimum
        agent_delivered[obj.agent_id].push(obj.dest_id);
        visited[obj.dest_id]=1;
        let temp_obj={ Latitude: data[obj.dest_id-1].latitude,Longitude:data[obj.dest_id-1].longitude};
    
        agent_current_location[obj.agent_id].current_location=temp_obj;
        agent_current_location[obj.agent_id].time=obj.d;
        count++;// increment the count 
    }
    


}
function input_data()
{
    let url="https://zorang-recrutment.s3.ap-south-1.amazonaws.com/addresses.json";// url which is provided in the problem statement

   fetch(url)           //api for the get request
  .then(response => response.json())
  .then(function(data){

    solution(data);// solution of the problem
    console.log("solved");
  });
}

input_data();// extracting data from the api 