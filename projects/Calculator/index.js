function addFun(){
    function append(re){
      let rt = re.concat(' ' + "+")
      return rt
    }
    let addition = document.getElementById('yu').value.trim();
    // addition.innerHTML
    console.log(addition)
    let gh = append(addition)
    console.log(gh)
    addition = gh
    let yh = addition.insertCell(1);
    console.log(yh)
   
    
    // addition.append("+")
    //  let g = document.get


}
// function append(re){
//    let rt = re.concat(' ' + "+")
//    return rt
// }