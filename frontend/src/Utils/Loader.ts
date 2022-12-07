export class Loader {
  constructor(private forceUpdate: () => void) {}
  public tasks: Array<Promise<any>> = [];

  get isLoading(): boolean {
    return this.tasks.length > 0;
  }

  waitFor<T>(task: Promise<T>) {
    this.tasks = [...this.tasks, task];
    console.log("Add");
    this.forceUpdate();
    task.finally(() => {
      this.tasks = this.tasks.filter((t) => t !== task);
      this.forceUpdate();
      console.log("pop");
    });
  }

  toString() {
    return `tasks: ${this.tasks?.length}`;
  }
}
