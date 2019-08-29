import run from "../welcome";
import fs from "fs";
import yaml from "js-yaml";
import * as core from "@actions/core";

// Load all of the values from action.yml into the process.env
const loadActionYaml = () => {
  const doc = yaml.safeLoad(
    fs.readFileSync(__dirname + "/../action.yml", "utf8")
  );
  Object.entries(doc.inputs).forEach(([name, values]) => {
    process.env[`INPUT_${name.toUpperCase()}`] = (values as any).default;
  });
};

beforeAll(() => {
  loadActionYaml();
});

describe("outputs debug information", () => {
  it("uses the input to send a debug string", async () => {
    let debugMock = jest.spyOn(core, "debug");
    await run();
    expect(debugMock).toHaveBeenCalledWith("Welcome from spooky & stella!");
  });
});
