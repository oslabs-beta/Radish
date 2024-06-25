export interface DockerComposeFile {
  version: string;
  services: Record<string, Service>; // Services with string keys and Service values
  volumes?: Record<string, unknown>; // Volumes with string keys and unknown values
  networks?: Record<string, Network>; // Networks with string keys and Network values
}

export interface Service {
  image?: string;
  build?: string | Build;
  ports?: string[];
  environment?: Record<string, string> | string[];
  volumes?: string[];
  networks?: string[] | Record<string, unknown>;
  [key: string]: unknown; // for additional properties
}

export interface Build {
  context: string;
  dockerfile?: string;
  args?: Record<string, string>;
  [key: string]: unknown; // for additional properties
}

export interface Network {
  driver: string;
  ipam?: Ipam;
  [key: string]: unknown; // for additional properties
}

export interface Ipam {
  config: Array<{ subnet: string }>;
  [key: string]: unknown; // for additional properties
}

// Example dockerCompose object
