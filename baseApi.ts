import express, { Express } from "express";
const fs = require("fs");

type IBaseModel = {
  id: string;
  type: string;
  version?: number;
  lastUpdate?: number;
};

export class FileManager<T = any> {
  constructor(private relativePath: string, private extension: string = ".json") {}

  load() {
    try {
      const data = fs.readFileSync(this.relativePath + this.extension, "utf8");
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  save(data: T[]) {
    fs.writeFileSync(this.relativePath + this.extension, JSON.stringify(data, null, 2));
  }
}

export function createRoute(app: Express, path: string) {
  return new RouteCreator(app, path);
}

export class RouteCreator<T extends IBaseModel> {
  private _router = express.Router();
  private fileManager: FileManager<T>;

  constructor(app: Express, private path: string, fileRelativePath?: string) {
    this.fileManager = new FileManager<T>("db/" + (fileRelativePath ?? path));

    this.getOne_get();
    this.getAll_get();
    this.addOne_post();
    this.updateOne_put();
    this.updateMany_put();
    this.deleteOne_delete();
    this.deleteAll_delete();

    app.use("/" + path, this._router);
  }

  protected getOne_get() {
    this._router.get("/:id", (req, res) => {
      const data = this.fileManager.load();
      const search = data.find((x: any) => x.id == req.params.id);
      res.json(search);
    });
  }
  // count = 1;
  protected getAll_get() {
    this._router.get("/", (req, res) => {
      const data = this.fileManager.load();
      // console.log("getAll", this.count++);

      res.json(data);
    });
  }

  protected addOne_post() {
    this._router.post("/", (req, res) => {
      const newData = req.body as T;
      const data = this.fileManager.load() as T[];
      if (newData.id == null) {
        newData.id = Math.random().toString();
      }
      newData.version = 0;
      data.push(newData);
      this.fileManager.save(data);
      res.json({ message: "Data added successfully", id: newData.id });
    });
  }

  protected updateOne_put() {
    this._router.put("/:id", (req, res) => {
      const id = req.params.id;
      const updatedData = req.body as T;
      const data = this.fileManager.load() as T[];
      const index = data.findIndex((item: T) => item.id == id);
      if (index !== -1) {
        updatedData.version = (data[index].version ?? 0) + 1;
        data[index] = updatedData;
        this.fileManager.save(data);
        res.json({ message: "Data updated successfully", id: data[index].id });
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    });
  }

  protected updateMany_put() {
    this._router.put("/", (req, res) => {
      const updates: T[] = req.body; // Array of update objects
      const data: T[] = this.fileManager.load();

      let updatedCount = 0;
      const changedItems = [];
      for (const update of updates) {
        const index = data.findIndex((item) => item.id == update.id);
        if (index !== -1) {
          update.version = (data[index].version ?? 0) + 1;
          data[index] = { ...data[index], ...update }; // Update matching item
          changedItems.push(data[index]);
          updatedCount++;
        }
      }

      this.fileManager.save(data);

      if (updatedCount > 0) {
        res.json({ message: `${updatedCount} data items updated successfully`, items: changedItems });
      } else {
        res.status(404).json({ message: "No data items found to update" });
      }
    });
  }

  protected deleteOne_delete() {
    this._router.delete("/:id", (req, res) => {
      const id = req.params.id;
      const data = this.fileManager.load();
      const index = data.findIndex((item: any) => item.id == id);
      if (index !== -1) {
        data.splice(index, 1);
        this.fileManager.save(data);
        res.json({ message: "Data deleted successfully" });
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    });
  }
  protected deleteAll_delete() {
    this._router.delete("/", (req, res) => {
      this.fileManager.save([] as T[]);
      res.json({ message: "All Data deleted successfully" });
    });
  }
}
