import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRedisState } from "../Redux/slices/redisFormSlice";

const RedisForm = () => {
  const dispatch = useDispatch();
  const redisState = useSelector(state => state.redis);
  console.log("redisState", redisState);



  return (
    <div id="redis-form">
      <h1>redis.conf customization</h1>
      <h2>Administration</h2>
      
      <div id="admin">
        <div className="redis-form-input">
          <label for="port" >Port</label>
          <input id="port" type="number" />
        </div>

        <div className="redis-form-input">
          <input id="deamonize" type="checkbox" checked />
          <label for="daemonize">daemonize?</label>
        </div>

        <div className="redis-form-input">
          <label for="masterauth">require masterauth password?</label>
          <input id="masterauth" type="text" />
        </div>
       
        <div className="redis-form-input">
          <label for="masteruser">require masteruser credentials?</label>
          <input id="masteruser" type="text" />
        </div>
      </div>

      <div className="redis-form-input">
        <label for="loglevel">log setting</label>
        <select id="loglevel" >
          <option value="notice">notice</option>
          <option value="verbose">verbose</option>
          <option value="debug">debug</option>
        </select>
      </div>

      <div className="redis-form-input">
        <label for="timeout">timeout</label>
        <input id="timeout" type="number" value={redisState.timeout}/>
      </div>

      <h2>Persistance Management</h2>

      <div id="persistance">
        <div className="redis-form-input">
          <label for="saveSeconds">minimum time between RDB snapshots</label>
          <input id="saveSeconds" type="number" value={redisState.saveSeconds}/>
        </div>

        <div className="redis-form-input">
          <label for="saveChanges">number of changes made within time interval to trigger a snapshot</label>
          <input id="saveChanges" type="number" value={redisState.saveChanges}/>
        </div>

        <div className="redis-form-input">
          <input id="appendonly" type="checkbox" checked value={redisState.appendonly}/>
          <label for="appendonly">enable appendonly (AOF) mode</label>
        </div>

        <div className="redis-form-input">
          <label for="appendfsync">choose an AOF sync method</label>
          <select id="appendfsync" value={redisState.appendfsync}>
            <option value="everysec">everysec</option>
            <option value="no">no</option>
            <option value="always">always</option>
          </select>
        </div >
      </div>

      <h2>Memory and Performance Management</h2>  

      <div id="memory">

        <div className="redis-form-input">
          <input id="rdbcompression" type="checkbox" checked value={redisState.rdbcompression}/>
          <label for="rdbcompression">rdb compression</label>
        </div>

        <div className="redis-form-input">
          <input id="rdbchecksum" type="checkbox" value={redisState.rdbchecksum}/>
          <label for="rdbchecksum">redchecksum</label>
        </div>

        <div className="redis-form-input">
          <input id="replicaServeStaleData" type="checkbox" value={redisState.replicaServeStaleData}/>
          <label for="replicaServeStaleData">serve stale data?</label>
        </div>

        <div className="redis-form-input">
          <label for="maxmemory"></label>
          <input id="maxmemory" type="number" value={redisState.maxmemory}/>
        </div>

        <div className="redis-form-input"> 
          <label for="maxmemoryPolicy"></label>
          <select id="maxmemoryPolicy" value={redisState.maxmemoryPolicy}>
            <option value="noeviction">noeviction</option>
            <option value="allkeys-lru">allkeys-lru</option>
            <option value="volatile-lru">volatile-lru</option>
            <option value="allkeys-lfu">allkey=lfu</option>
            <option value="volatile-lfu">volatile-lfu</option>
            <option value="volatile-random">voltile-random</option>
            <option value="allkeys-random">allkey-random</option>
          </select>
        </div>
      </div>
    </div>
  )
};

export default RedisForm;