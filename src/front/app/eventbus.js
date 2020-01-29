var eventBus = (function EventBus(){
  var events = {};
  return {
      on: (eventName, callback) => {
        if (!events[eventName]){
          events[eventName] = [];
        }
        events[eventName].push(callback);
      },
      publish: (eventName, data) => {
        if (events[eventName]){
          events[eventName].forEach(cb => cb(data));
        }
      }
  };    
})();

export default eventBus;