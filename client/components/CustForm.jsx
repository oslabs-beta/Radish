import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShardsValue,
  setReplicasValue,
  setSentinelsValue,
} from "../Redux/slices/sliderSlice";
import "../../public/style.css";

const RedisForm = () => {
  const dispatch = useDispatch();
  const sliderState = useSelector((state) => state.slider);

  const handleSliderChange = (field, value) => {
    if (field === "shards") {
      dispatch(setShardsValue(value));
    } else if (field === "replicas") {
      dispatch(setReplicasValue(value));
    }
  };

  return (
    <form
      id="redis-form"
      className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
      action="/test/createFiles"
      method="POST"
    >
      <h1 className="text-2xl font-bold mb-4">Redis Configuration</h1>

      {/* Administration Section */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Administration</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Number of Shards */}
          <div className="redis-form-input">
            <label htmlFor="shards" className="block mb-1">
              Number of Shards
            </label>
            <input
              type="number"
              name="shards"
              id="shards"
              value={sliderState.shardsValue}
              onChange={(e) => handleSliderChange("shards", e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Number of Replicas */}
          <div className="redis-form-input">
            <label htmlFor="replicas" className="block mb-1">
              Number of Replicas
            </label>
            <input
              type="number"
              name="replicas"
              id="replicas"
              value={sliderState.replicasValue}
              onChange={(e) => handleSliderChange("replicas", e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </section>

      {/* Port and Daemonize Checkbox */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Additional Settings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Port Input */}
          <div className="redis-form-input">
            <label htmlFor="port" className="block mb-1">
              Port
            </label>
            <input
              type="number"
              name="port"
              id="port"
              className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Daemonize Checkbox */}
          <div className="redis-form-input flex items-center">
            <input
              type="checkbox"
              name="daemonize"
              id="daemonize"
              className="mr-2"
            />
            <label htmlFor="daemonize">Daemonize?</label>
          </div>
        </div>
      </section>

      {/* Master Auth and User Credentials */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Security Settings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Master Auth Password */}
          <div className="redis-form-input">
            <label htmlFor="masterauth" className="block mb-1">
              Require Master Auth Password?
            </label>
            <input
              type="text"
              name="masterauth"
              id="masterauth"
              className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Master User Credentials */}
          <div className="redis-form-input">
            <label htmlFor="masteruser" className="block mb-1">
              Require Master User Credentials?
            </label>
            <input
              type="text"
              name="masteruser"
              id="masteruser"
              className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </section>

      {/* Log Level */}
      <div className="mb-6">
        <label htmlFor="loglevel" className="block mb-1">
          Log Level
        </label>
        <select
          name="loglevel"
          id="loglevel"
          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
        >
          <option value="notice">Notice</option>
          <option value="verbose">Verbose</option>
          <option value="debug">Debug</option>
        </select>
      </div>

      {/* Timeout */}
      <div className="mb-6">
        <label htmlFor="timeout" className="block mb-1">
          Timeout
        </label>
        <input
          type="number"
          name="timeout"
          id="timeout"
          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Submit Configuration
      </button>
    </form>
  );
};

export default RedisForm;

// const RedisForm = () => {
//   const dispatch = useDispatch();
//   const sliderState = useSelector((state) => state.slider);
//   // console.log("redisState", redisState);

//   return (
//     <form id="redis-form" action="/test/createFiles" method="POST">
//       <h1 id="redis-conf-header">redis.conf customization</h1>
//       <h2>Administration</h2>

//       <div id="admin">
//         <div className="redis-form-input">
//           <label htmlFor="shards">number of shards</label>
//           <input
//             type="number"
//             name="shards"
//             id="shards"
//             value={sliderState.shardsValue}
//             onChange={(e) => {
//               dispatch(setShardsValue(e.target.value));
//             }}
//           />
//           <label htmlFor="replicas">number of replicas</label>
//           <input
//             type="number"
//             name="replicas"
//             id="replicas"
//             value={sliderState.replicasValue}
//             onChange={(e) => {
//               dispatch(setReplicasValue(e.target.value));
//             }}
//           />
//         </div>

//         <div className="redis-form-input"></div>

//         <div className="redis-form-input">
//           <label htmlFor="port">Port</label>
//           <input name="port" id="port" type="number" />
//         </div>

//         <div className="redis-form-input">
//           <input name="daemonize" id="deamonize" type="checkbox" value={true} />
//           <label htmlFor="daemonize">daemonize?</label>
//         </div>

//         <div className="redis-form-input">
//           <label htmlFor="masterauth">require masterauth password?</label>
//           <input name="masterauth" id="masterauth" type="text" />
//         </div>

//         <div className="redis-form-input">
//           <label htmlFor="masteruser">require masteruser credentials?</label>
//           <input name="masteruser" id="masteruser" type="text" />
//         </div>
//       </div>

//       <div className="redis-form-input">
//         <label htmlFor="loglevel">log setting</label>
//         <select name="loglevel" id="loglevel">
//           <option selected value="notice">
//             notice
//           </option>
//           <option value="verbose">verbose</option>
//           <option value="debug">debug</option>
//         </select>
//       </div>

//       <div className="redis-form-input">
//         <label htmlFor="timeout">timeout</label>
//         <input name="timeout" id="timeout" type="number" />
//       </div>

//       <h2>Persistance Management</h2>

//       <div id="persistance">
//         <div className="redis-form-input">
//           <label htmlFor="saveSeconds">
//             minimum time between RDB snapshots
//           </label>
//           <input name="saveSeconds" id="saveSeconds" type="number" />
//         </div>

//         <div className="redis-form-input">
//           <label htmlFor="saveChanges">
//             number of changes made within time interval to trigger a snapshot
//           </label>
//           <input name="saveChanges" id="saveChanges" type="number" />
//         </div>

//         <div className="redis-form-input">
//           <input
//             name="appendonly"
//             id="appendonly"
//             type="checkbox"
//             value={true}
//           />
//           <label for="appendonly">enable appendonly (AOF) mode</label>
//         </div>

//         <div className="redis-form-input">
//           <label htmlFor="appendfsync">choose an AOF sync method</label>
//           <select name="appendfsync" id="appendfsync">
//             <option selected value="everysec">
//               everysec
//             </option>
//             <option value="no">no</option>
//             <option value="always">always</option>
//           </select>
//         </div>
//       </div>

//       <h2>Memory and Performance Management</h2>

//       <div id="memory">
//         <div className="redis-form-input">
//           <input
//             name="rdbcompression"
//             id="rdbcompression"
//             type="checkbox"
//             value={true}
//           />
//           <label htmlFor="rdbcompression">rdb compression</label>
//         </div>

//         <div className="redis-form-input">
//           <input
//             name="rdbchecksum"
//             id="rdbchecksum"
//             type="checkbox"
//             value={true}
//           />
//           <label htmlFor="rdbchecksum">redchecksum</label>
//         </div>

//         <div className="redis-form-input">
//           <input
//             name="replicaServeStaleData"
//             id="replicaServeStaleData"
//             type="checkbox"
//             value={true}
//           />
//           <label htmlFor="replicaServeStaleData">serve stale data?</label>
//         </div>

//         <div className="redis-form-input">
//           <label htmlFor="maxmemory"></label>
//           <input name="maxmemory" id="maxmemory" type="number" />
//         </div>

//         <div className="redis-form-input">
//           <label htmlFor="maxmemoryPolicy"></label>
//           <select name="maxmemoryPolicy" id="maxmemoryPolicy">
//             <option selected value="noeviction">
//               noeviction
//             </option>
//             <option value="allkeys-lru">allkeys-lru</option>
//             <option value="volatile-lru">volatile-lru</option>
//             <option value="allkeys-lfu">allkey=lfu</option>
//             <option value="volatile-lfu">volatile-lfu</option>
//             <option value="volatile-random">voltile-random</option>
//             <option value="allkeys-random">allkey-random</option>
//           </select>
//         </div>
//       </div>
//       <button type="submit">submit config</button>
//     </form>
//   );
// };

// export default RedisForm;
