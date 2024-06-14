import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setShardsValue,
  setReplicasValue,
  setSentinelsValue,
} from '../Redux/slices/sliderSlice';
import '../../public/style.css';

const RedisForm = () => {
  const dispatch = useDispatch();
  const sliderState = useSelector(state => state.slider);
  // console.log("redisState", redisState);

  return (
    <form
      id="redis-form"
      action="/test/createFiles"
      method="POST"
      className="p-0"
    >
      {/* <h1 id="redis-conf-header">redis.conf customization</h1> */}
      {/* <h2>Administration</h2> */}

      <div id="admin">
        {/* <div className="redis-form-input">
          <label htmlFor="shards">number of shards</label>
          <input
            type="number"
            name="shards"
            id="shards"
            value={sliderState.shardsValue}
            onChange={e => {
              dispatch(setShardsValue(e.target.value));
            }}
          />
          <label htmlFor="replicas">number of replicas</label>
          <input
            type="number"
            name="replicas"
            id="replicas"
            value={sliderState.replicasValue}
            onChange={e => {
              dispatch(setReplicasValue(e.target.value));
            }}
          />
        </div> */}

        <div className="redis-form-input">
          <label htmlFor="port">Port</label>
          <input name="port" id="port" type="number" />
        </div>

        <div className="redis-form-input">
          <input name="daemonize" id="deamonize" type="checkbox" value={true} />
          <label htmlFor="daemonize" className="">
            daemonize?
          </label>
        </div>

        <div className="redis-form-input">
          <label htmlFor="masterauth">require masterauth password?</label>
          <input name="masterauth" id="masterauth" type="text" />
        </div>

        <div className="redis-form-input">
          <label htmlFor="masteruser">require masteruser credentials?</label>
          <input name="masteruser" id="masteruser" type="text" />
        </div>
      </div>

      <div className="redis-form-input">
        <label htmlFor="loglevel">log setting</label>
        <select name="loglevel" id="loglevel">
          <option selected value="notice">
            notice
          </option>
          <option value="verbose">verbose</option>
          <option value="debug">debug</option>
        </select>
      </div>

      <div className="redis-form-input">
        <label htmlFor="timeout">timeout</label>
        <input name="timeout" id="timeout" type="number" />
      </div>

      <div id="persistance">
        <div className="redis-form-input">
          <h2>Persistance Management</h2>
          <label htmlFor="saveSeconds">
            minimum time between RDB snapshots
          </label>
          <input name="saveSeconds" id="saveSeconds" type="number" />
        </div>

        <div className="redis-form-input">
          <label htmlFor="saveChanges">
            number of changes made within time interval to trigger a snapshot
          </label>
          <input name="saveChanges" id="saveChanges" type="number" />
        </div>

        <div className="redis-form-input">
          <input
            name="appendonly"
            id="appendonly"
            type="checkbox"
            value={true}
          />
          <label for="appendonly">Enable appendonly (AOF) mode</label>
        </div>

        <div className="redis-form-input">
          <label htmlFor="appendfsync">choose an AOF sync method</label>
          <select name="appendfsync" id="appendfsync">
            <option selected value="everysec">
              everysec
            </option>
            <option value="no">no</option>
            <option value="always">always</option>
          </select>
        </div>
      </div>

      <div id="memory">
        <div className="redis-form-input">
          <h2>Memory and Performance Management</h2>
          <input
            name="rdbcompression"
            id="rdbcompression"
            type="checkbox"
            value={true}
          />
          <label htmlFor="rdbcompression">rdb compression</label>
        </div>

        <div className="redis-form-input">
          <input
            name="rdbchecksum"
            id="rdbchecksum"
            type="checkbox"
            value={true}
          />
          <label htmlFor="rdbchecksum">redchecksum</label>
        </div>

        <div className="redis-form-input">
          <input
            name="replicaServeStaleData"
            id="replicaServeStaleData"
            type="checkbox"
            value={true}
          />
          <label htmlFor="replicaServeStaleData">serve stale data?</label>
        </div>

        <div className="redis-form-input">
          <label htmlFor="maxmemory"></label>
          <input name="maxmemory" id="maxmemory" type="number" />
        </div>

        <div className="redis-form-input">
          <label htmlFor="maxmemoryPolicy"></label>
          <select name="maxmemoryPolicy" id="maxmemoryPolicy">
            <option selected value="noeviction">
              noeviction
            </option>
            <option value="allkeys-lru">allkeys-lru</option>
            <option value="volatile-lru">volatile-lru</option>
            <option value="allkeys-lfu">allkey=lfu</option>
            <option value="volatile-lfu">volatile-lfu</option>
            <option value="volatile-random">voltile-random</option>
            <option value="allkeys-random">allkey-random</option>
          </select>
          <button type="submit" className="">
            submit config
          </button>
        </div>
      </div>
    </form>
  );
};

export default RedisForm;
