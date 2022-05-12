# VirGUI
VirGUI is a Virtual Machine Management GUI providing basic control over Virtual Machines running on libvirt

## Example
```
import VirshConnection from "./VirshConnector.ts"

const virshConnector = new VirshConnection("qemu+ssh://root@localhost/system");

const machines = await virshConnector.getVirtualMachines();

console.log(machines);
const started = await machines.find(machine => machine.name === "Machine-1")?.start();

if (started) {
  console.log("Machine started!");
}
```