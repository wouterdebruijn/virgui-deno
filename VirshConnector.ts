import VirtualMachine from "./VirtualMachine.ts";

/**
 * Virsh Connector. This class is used to connect to a virsh instance by url.
 */
class VirshConnector {
  /**
   * Create a new Virsh Connector instance.
   * @param qemuURL The url of the qemu instance. Example: "qemu+ssh://user@192.168.1.10/system"
   */
  constructor(private qemuURL: string) {}

  /**
   * Get the list of virtual machines.
   * @returns A list of all virsh instances.
   */
  public async getVirtualMachines() {
    const virshListProcess = Deno.run({
      cmd: [
        "virsh",
        "-c",
        this.qemuURL,
        "list",
        "--all",
      ],
      stdout: "piped",
    });

    const textDecoder = new TextDecoder();
    const virshList = textDecoder.decode(await virshListProcess.output());
    return this.parseVirshList(virshList);
  }

  /**
   * Start a virtual machine.
   * @param vm The virtual machine to start.
   * @returns True if the virtual machine was started, false otherwise.
   */
  public startVirtualMachine(vm: VirtualMachine) {
    return this.runSimpleCommand(vm, ["start"]);
  }

  /**
   * Stop a virtual machine.
   * @param vm The virtual machine to shutdown.
   * @returns True if the virtual machine was stopped, false otherwise.
   */
  public stopVirtualMachine(vm: VirtualMachine) {
    return this.runSimpleCommand(vm, ["shutdown"]);
  }

  /**
   * Destroy (stop) a virtual machine
   * @param vm The virtual machine to destroy.
   * @returns True if the virtual machine was destroyed, false otherwise.
   */
  public destroyVirtualMachine(vm: VirtualMachine) {
    return this.runSimpleCommand(vm, ["destroy"]);
  }

  /**
   * Reboot a virtual machine
   * @param vm The virtual machine to reboot.
   * @returns True if the virtual machine was rebooted, false otherwise.
   */
  public rebootVirtualMachine(vm: VirtualMachine) {
    return this.runSimpleCommand(vm, ["reboot"]);
  }

  /**
   * Reset a virtual machine
   * @param vm The virtual machine to reset.
   * @returns True if the virtual machine was reset, false otherwise.
   */
  public resetVirtualMachine(vm: VirtualMachine) {
    return this.runSimpleCommand(vm, ["reset"]);
  }

  /**
   * Resume a virtual machine
   * @param vm The virtual machine to resume.
   * @returns True if the virtual machine was resumed, false otherwise.
   */
  public resumeVirtualMachine(vm: VirtualMachine) {
    return this.runSimpleCommand(vm, ["resume"]);
  }

  /**
   * Suspend a virtual machine
   * @param vm The virtual machine to suspend.
   * @returns True if the virtual machine was suspended, false otherwise.
   */
  public suspendVirtualMachine(vm: VirtualMachine) {
    return this.runSimpleCommand(vm, ["suspend"]);
  }

  /**
   * Run a command on a virtual machine.
   * @param vm The virtual machine to run the command on.
   * @param command The command to run.
   * @returns True if the command executed successfully, false otherwise.
   */
  private async runSimpleCommand(vm: VirtualMachine, command: string[]) {
    const startVmProcess = Deno.run({
      cmd: [
        "virsh",
        "-c",
        this.qemuURL,
        ...command,
        vm.name,
      ],
      stdout: "null",
    });

    const status = await startVmProcess.status();
    return status.success;
  }

  private parseVirshList(list: string) {
    let lines = list.split("\n").map((line) => line.trim());

    lines = lines.map((line) => line.replace(/\ \ +/g, "*"));

    const headers = lines[0].split("*");
    const data = lines.slice(2).map((line) => line.split("*"));

    const vmList: VirtualMachine[] = [];

    for (const line of data) {
      if (line.length !== headers.length) {
        continue;
      }

      vmList.push(new VirtualMachine(line[0], line[1], line[2], this));
    }

    return vmList;
  }
}

export default VirshConnector;
