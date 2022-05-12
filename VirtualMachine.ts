import VirshConnector from "./VirshConnector.ts";

class VirtualMachine {
  constructor(
    public id: string,
    public name: string,
    public state: string,
    private virshConnector: VirshConnector,
  ) {}

  public async start() {
    if (this.state !== "shut off") {
      return false;
    }

    return (await this.virshConnector.startVirtualMachine(this));
  }

  public async stop() {
    if (this.state !== "running") {
      return false;
    }

    return (await this.virshConnector.stopVirtualMachine(this));
  }

  public async destroy() {
    if (this.state !== "running") {
      return false;
    }

    return (await this.virshConnector.destroyVirtualMachine(this));
  }

  public async reboot() {
    if (this.state !== "running") {
      return false;
    }

    return (await this.virshConnector.rebootVirtualMachine(this));
  }

  public async reset() {
    if (this.state !== "running") {
      return false;
    }

    return (await this.virshConnector.resetVirtualMachine(this));
  }

  public async resume() {
    if (this.state !== "paused") {
      return false;
    }

    return (await this.virshConnector.resumeVirtualMachine(this));
  }

  public async suspend() {
    if (this.state !== "running") {
      return false;
    }

    return (await this.virshConnector.suspendVirtualMachine(this));
  }
}

export default VirtualMachine;
