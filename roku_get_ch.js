import fs from 'fs';

let lastChId = "0"

const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Accept-Language", " en-US,en;q=0.5");
myHeaders.append("Accept-Encoding", " gzip, deflate, br, zstd");
myHeaders.append("Referer", " https://channelstore.roku.com/browse/recommended");
myHeaders.append("Connection", " keep-alive");
myHeaders.append("Sec-Fetch-Dest", " empty");
myHeaders.append("Sec-Fetch-Mode", " no-cors");
myHeaders.append("Sec-Fetch-Site", " same-origin");
myHeaders.append("Priority", " u=4");
myHeaders.append("Pragma", " no-cache");
myHeaders.append("Cache-Control", " no-cache");

const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

let count = 0
  async function fetchData(lastChildId) {
    let res = []
    fetch(`https://channelstore.roku.com/api/v7/channels?category=22CDB2ED-AF5E-4C7A-8CCF-6E18CCE49DF2&pagesize=100&lastChId=${lastChildId}&categoryType=tag&country=US&language=en`, requestOptions)
    .then((response) => response.json())
    .then((result) => {;
      for(let i = 0; i < result.length; i++) {
        let data = result[i];
        payload.push(data);
      }
      if(count++ < 50)
        console.log(count)
        fetchData(result[result.length - 1].id)
    })
    .catch((error) => 
      {console.log(error)
        
    fs.writeFile('data.json', JSON.stringify(payload, null, 2), (err) => {
        if (err) {
        console.error('Error writing file:', err);
        } else {
        console.log('File written successfully');
        }
    });
        // console.log(payload)
      });

  }

  let payload = []
  let currLastChild = "0"
await fetchData(currLastChild);
