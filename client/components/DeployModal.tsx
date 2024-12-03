import React, { useState, FC, ReactElement } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import { setCurrentIps } from "../Redux/slices/realClusterData";
import { toast } from "react-toastify";

const DeployModal: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const [clusterName, setClusterName] = useState("");
  const [amiPublicKey, setAmiPublicKey] = useState("");
  const [amiSecretKey, setAmiSecretKey] = useState("");
  const [vpcID, setVpcID] = useState("");
  const [subnetId, setSubnetId] = useState("");
  const [keyPairName, setKeyPairName] = useState("");

  const redisState = useAppSelector((state) => state.redis);
  const awsState = useAppSelector((state) => state.aws);
  const sliderState = useAppSelector((state) => state.slider);

  const closeModal = () => {
    setShow(false);
  };
  const openModal = () => {
    if (redisState.masterAuth === "") {
      toast.error(
        "Please fill out the Redis Configuration form before deploying your cluster"
      );
      return;
    }
    setShow(true);
  };

  const createEC2Cluster = async () => {
    try {
      console.log("req.body: ", {
        clusterName,
        amiPublicKey,
        amiSecretKey,
        vpcID,
        subnetId,
        keyPairName,
        ...redisState,
        ...awsState,
        ...sliderState,
      });
      toast.info("Creating your cluster, this may take a few minutes...");
      closeModal();
      const response = await fetch("/api/launchEC2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clusterName,
          amiPublicKey,
          amiSecretKey,
          vpcID,
          subnetId,
          keyPairName,
          ...redisState,
          ...awsState,
          ...sliderState,
        }),
      });
      const ips = await response.json();
      dispatch(setCurrentIps(ips));
      toast.success(
        "Cluster created successfully! Navigate to the Benchmarking tab to run performance tests."
      );
    } catch (err) {}
  };

  return (
    <div>
      <div>
        <Button
          className="mb-10 w-full mt-4 bg-red-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
          variant="danger"
        >
          Ready to Build!
        </Button>
      </div>
      <Modal
        id="modal-container"
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        show={show}
        onHide={closeModal}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto w-full p-6">
            <header className="text-black">
              <Modal.Title className="text-black">
                You're ready to deploy!
              </Modal.Title>
            </header>
            <div>
              <p className="text-black">We'll just need a few details</p>
            </div>
            <div>
              <label className="text-black">Name your cluster</label>
              <input
                type="text"
                value={clusterName}
                onChange={(e) => {
                  setClusterName(e.target.value);
                }}
                className="text-black border border-gray-300 rounded w-full p-2"
              />
              <label className="text-black">IAM Public Key</label>
              <input
                type="text"
                value={amiPublicKey}
                onChange={(e) => {
                  setAmiPublicKey(e.target.value);
                }}
                className="text-black border border-gray-300 rounded w-full p-2"
              />
              <label className="text-black">IAM Secret Key</label>
              <input
                type="text"
                value={amiSecretKey}
                onChange={(e) => {
                  setAmiSecretKey(e.target.value);
                }}
                className="text-black border border-gray-300 rounded w-full p-2"
              />
              <label className="text-black">VPC ID</label>
              <input
                type="text"
                value={vpcID}
                onChange={(e) => {
                  setVpcID(e.target.value);
                }}
                className="text-black border border-gray-300 rounded w-full p-2"
              />
              <label className="text-black">Subnet ID</label>
              <input
                type="text"
                value={subnetId}
                onChange={(e) => {
                  setSubnetId(e.target.value);
                }}
                className="text-black border border-gray-300 rounded w-full p-2"
              />
              <label className="text-black">EC2 Key Pair</label>
              <input
                type="text"
                value={keyPairName}
                onChange={(e) => {
                  setKeyPairName(e.target.value);
                }}
                className="text-black border border-gray-300 rounded w-full p-2"
              />
            </div>
            <footer>
              <Button
                className="text-black mt-4 bg-grey-500 py-2 px-4 rounded"
                onClick={closeModal}
              >
                Close
              </Button>
              <Button
                className="text-black mt-4 bg-red-800 py-2 px-4 rounded"
                onClick={createEC2Cluster}
              >
                CREATE THE CLUSTER
              </Button>
            </footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeployModal;
