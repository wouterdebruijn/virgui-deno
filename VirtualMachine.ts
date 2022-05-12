import VirshConnector from "./VirshConnector.ts";

class VirtualMachine {
  constructor(
    public id: string,
    public name: string,
    public state: string,
    private virshConnector: VirshConnector,
  ) {}

  public async start() {
    if (this.state === "running") {
      return false;
    }

    return (await this.virshConnector.startVirtualMachine(this));
  }

  public async stop() {
    if (this.state === "shut off") {
      return false;
    }

    return (await this.virshConnector.stopVirtualMachine(this));
  }
}

export default VirtualMachine;
