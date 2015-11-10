import agent from './agent';

class DestinationSource {

  fetch(placeId) {
    return agent.get(`/destinations/${placeId}`)
      .accept('application/json')
      .then( res => res.body );
  }

}

module.exports = new DestinationSource()
