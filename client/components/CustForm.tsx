import React, { FC, ReactElement, useRef, FormEvent } from "react";
import "../../public/style.css";
// import { useAppSelector, useAppDispatch } from "../Redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../Redux/store";
// import { Tooltip } from 'chart.js';
import { Tooltip } from "react-tooltip";
// import "../../public/style.css";
import {
  setPort,
  setMasterauth,
  setMasteruser,
  setDaemonize,
  setLoglevel,
  setTimeout,
  setSaveSeconds,
  setSaveChanges,
  setAppendonly,
  setAppendfsync,
  setRdbcompression,
  setRdbchecksum,
  setMaxmemory,
  setMaxmemoryPolicy,
} from "../Redux/slices/redisFormSlice";

const RedisForm: FC = (): ReactElement => {
  const sliderState = useSelector((state: RootState) => state.slider);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formRef = useRef(null);
  // console.log("redisState", redisState);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/pricing')
  };

  return (
    <>
      <form
        // id="redis-form"
        // action="/api/createFiles"
        // method="POST"
        className="p-0"
        // ref={formRef}
        onSubmit = {submitForm}
      >
        {/* <h1 id="redis-conf-header">redis.conf customization</h1> */}
        {/* <h2>Administration</h2> */}
        <input
          type="hidden"
          name="shards"
          id="shards"
          value={sliderState.shardsValue}
        />
        <input
          type="hidden"
          name="replicas"
          id="replicas"
          value={sliderState.replicasValue}
        />
        <div id="admin" className="space-y-4">
          <div className="redis-form-input">
            <a
              data-tooltip-id="port"
              data-tooltip-content="The port number each node in the Redis node listens on (default is 6379)."
              className="text-xl "
            >
              {" "}
              Port
            </a>
            <Tooltip id="port" />
            <label htmlFor="port"></label>
            <input
              name="portNumber"
              id="port"
              type="number"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setPort(Number(e.target.value)));
              }}
              defaultValue={6379}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
            />
          </div>

          <div className="redis-form-input">
            <a
              data-tooltip-id="masterauth"
              data-tooltip-content="The password used for authenticating the Redis replica (slave) with the master instance in each shard.  If your Redis cluster setup involves replication, the 'masterauth' parameter will be added to each replica's config file."
              className="text-xl"
            >
              Requirepass password (REQUIRED)
            </a>
            <Tooltip id="masterauth" className="tooltip" />
            <label htmlFor="masterauth"></label>
            <input
              name="masterauth"
              id="masterauth"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setMasterauth(e.target.value));
              }}
              type="text"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
            />
          </div>

          <div className="redis-form-input">
            <a
              data-tooltip-id="masteruser"
              data-tooltip-content="The username that will be used for authenticating with the master Redis instance in each shard.  This is an advanced security configuration to provide fine grain access/control."
              className="text-xl"
            >
              Masteruser credentials (optional)
            </a>
            <Tooltip id="masteruser" className="tooltip" />
            <label htmlFor="masteruser"></label>
            <input
              name="masteruser"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setMasteruser(e.target.value));
              }}
              id="masteruser"
              type="text"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
            />
          </div>
        </div>

        <div className="redis-form-input">
          <a
            data-tooltip-id="daemonize"
            data-tooltip-content="Controls whether Redis runs as a daemon (i.e., in the background) or in the foreground.  Redis typically only runs in the foreground (i.e., attached to the terminal or session that started it) when in development.  Daemons are recommended for production environments."
            className="text-xl "
          >
            Daemonize
          </a>
          <Tooltip id="daemonize" className="tooltip" />
          <label htmlFor="daemonize"></label>
          <select
            onChange={(e) => {
              console.log(e.target.value);
              dispatch(setDaemonize(e.target.value));
            }}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
            name="daemonize"
            id="daemonize"
          >
            <option selected value="no">
              no
            </option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="redis-form-input">
          <a
            data-tooltip-id="loglevel"
            data-tooltip-content="Controls the amount of information contained within the Redis logs.  From most verbose to least: debug -> verbose -> notice -> warning."
            className="text-xl"
          >
            Log setting
          </a>
          <Tooltip id="loglevel" className="tooltip" />
          <label htmlFor="loglevel"></label>
          <select
            name="loglevel"
            onChange={(e) => {
              console.log(e.target.value);
              dispatch(setLoglevel(e.target.value));
            }}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
            id="loglevel"
          >
            <option selected value="debug">
              debug
            </option>
            <option value="verbose">verbose</option>
            <option value="notice">notice</option>
            <option value="warning">warning</option>
          </select>
        </div>

        <div className="redis-form-input">
          <a
            data-tooltip-id="cluster-node-timeout"
            data-tooltip-content="Defines how long the node will wait for responses from other nodes before marking them as unreachable.  Once a node is marked as unreachable, within a Redis cluster, the failover process is initiated.  If no value is specified in the redis.conf file, then the default value is 15,000 (15 seconds)."
            className="text-xl"
          >
            Node timeout (milliseconds)
          </a>
          <Tooltip id="cluster-node-timeout" className="tooltip" />
          <label htmlFor="cluster-node-timeout"></label>
          <input
            name="cluster-node-timeout"
            onChange={(e) => {
              console.log(e.target.value);
              dispatch(setTimeout(Number(e.target.value)));
            }}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
            id="timeout"
            type="number"
            defaultValue={1000}
          />
        </div>

        <div id="persistance">
          <div className="redis-form-input">
            <a
              data-tooltip-id="saveSeconds"
              data-tooltip-content="Add a user-defined time period you want the Redis DB contents to be backed up to a file.  By default, Redis snapshotting is enabled and occurs at the following frequencies: Every 900 seconds (15 minutes) there is at least one change, every 5 minutes there is at least 10 changes, and every minute there are at least 10,000 changes."
              className="text-xl"
            >
              Minimum time between RDB snapshots (seconds)
            </a>
            <Tooltip id="saveSeconds" className="tooltip" />
            <label htmlFor="saveSeconds"></label>
            <input
              name="saveSeconds"
              id="saveSeconds"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setSaveSeconds(Number(e.target.value)));
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
              type="number"
              defaultValue={1000}
            />
          </div>

          <div className="redis-form-input">
            <a
              data-tooltip-id="saveChanges"
              data-tooltip-content="Add a user-defined number of changes that you want the Redis DB contents to be backed up to a file.  This value will be paired with the 'Minimum time between RDB snapshots'.  By default, Redis snapshotting is enabled and occurs at the following frequencies: Every 900 seconds (15 minutes) there is at least one change, every 5 minutes there is at least 10 changes, and every minute there are at least 10,000 changes."
              className="text-xl"
            >
              Minimum number of changes to trigger an RDB snapshot
            </a>
            <Tooltip id="saveChanges" className="tooltip" />
            <label htmlFor="saveChanges"></label>
            <input
              name="saveChanges"
              id="saveChanges"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setSaveChanges(Number(e.target.value)));
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
              type="number"
              defaultValue={1000}
            />
          </div>

          <div className="redis-form-input">
            <a
              data-tooltip-id="appendonly"
              data-tooltip-content="As an additional optional method of data backup and persistence, AOF can be enabled which logs every write operation to a log file.  The entire DB can be restored using an AOF file; however, it is more common to use AOF with RDB snapshoting.  When Redis loads, it will load the data from the latest RDB snapshot (which is faster than recreating everything from an AOF file) and then the write operations are replayed from the .aof file syncing the DB with the latest writes that were not captured by the RDB snapshot."
              className="text-xl"
            >
              Enable append only file (AOF)
            </a>
            <Tooltip id="appendonly" className="tooltip" />
            <label htmlFor="appendonly"></label>
            <select
              name="appendonly"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setAppendonly(e.target.value));
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
              id="appendonly"
            >
              <option selected value="no">
                no
              </option>
              <option value="yes">yes</option>
            </select>
          </div>

          <div className="redis-form-input">
            <a
              data-tooltip-id="appendfsync"
              data-tooltip-content="When using AOF, you can further specify how often the write operations are appended and saved to the .aof file.  A description of the options are as follows:  ALWAYS: Redis waits for every write operation to be written to disk.  Provides the highest durability, but can impact peformance due to frequent disk I/O operations, EVERYSEC: Redis writes to disk every second.  This is considered a balanced approach between durability and performance, and NO: Redis doesn't perform syncing operations and relies on the operating system's default behavior for file writes.  This is the least durable of the three options, but the most performant."
              className="text-xl"
            >
              AOF Sync Behavior
            </a>
            <Tooltip id="appendfsync" className="tooltip" />
            <label htmlFor="appendfsync"></label>
            <select
              name="appendfsync"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setAppendfsync(e.target.value));
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
              id="appendfsync"
            >
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
            <a
              data-tooltip-id="rdbcompression"
              data-tooltip-content="As an optional parameter, the RDB snapshots can be compressed to save on disk space at a cost of a little CPU overhead during the snapshotting process."
              className="text-xl"
            >
              RDB compression
            </a>
            <Tooltip id="rdbcompression" className="tooltip" />
            <label htmlFor="rdbcompression"></label>
            <select
              name="rdbcompression"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setRdbcompression(e.target.value));
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
              id="rdbcompression"
            >
              <option selected value="no">
                no
              </option>
              <option value="yes">yes</option>
            </select>
          </div>

          <div className="redis-form-input">
            <label htmlFor="rdbchecksum">redchecksum</label>
            <select
              name="rdbchecksum"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setRdbchecksum(e.target.value));
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
              id="rdbchecksum"
            >
              <option selected value="no">
                no
              </option>
              <option value="yes">yes</option>
            </select>
          </div>

          <div className="redis-form-input">
            <label htmlFor="replicaServeStaleData" className="text-xl">
              serve stale data?
            </label>
            <select
              name="replicaServeStaleData"
              id="replicaServeStaleData"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
            >
              <option selected value="no">
                no
              </option>
              <option value="yes">yes</option>
            </select>
          </div>

          <div className="redis-form-input">
            <label htmlFor="maxmemory">Maximum memory allowed (in bytes)</label>
            <input
              name="maxmemory"
              id="maxmemory"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setMaxmemory(e.target.value));
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
              type="number"
              defaultValue={5368709120}
            />
          </div>

          <div className="redis-form-input">
            <label htmlFor="maxmemoryPolicy">Maxmemory eviction policy</label>
            <select
              name="maxmemoryPolicy"
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setMaxmemoryPolicy(e.target.value));
              }}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm mt-2 text-black"
              id="maxmemoryPolicy"
            >
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
            <button type="submit" className="btn-primary mt-4 text-xl">
              Submit and move to pricing confirmation
            </button>
          </div>
        </div>
      </form>
      <div>
       
      </div>
    </>
  );
};

export default RedisForm;
