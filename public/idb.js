function data(){
  return new Promise(function(resolve) {
	var data = indexedDB.open('rating_sync', 1)
    data.onsuccess = () => {
	    var store = data.result.transaction("rating_data", "readwrite").objectStore("rating_data")
	    var dishes = store.getAll();
	    dishes.onsuccess = () =>{
	      var rating = dishes.result
	      // console.log("FUNCTION CHECKING", rating)
	      return resolve(rating)
	    }
    }
  })
  // console.log("FUNCTION CHECKING")
}
