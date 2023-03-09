#! /usr/bin/env node

import fs from "fs";
import { execSync, spawn } from "child_process";
const Watcher = (await import("/usr/local/lib/node_modules/watcher/dist/watcher.js")).default;

if(fs.readdirSync("/api").length === 0){
    console.log("Init npm project.");
    execSync("npm init -y", {stdio: "ignore", cwd: "/api"});
    console.log("Install anotherback");
    execSync("npm install anotherback@" + process.env.AOB_V, {stdio: "ignore", cwd: "/api"});
    execSync("chown -R node . && chgrp -R node .", {stdio: "ignore", cwd: "/api"});
}

if(!fs.existsSync("/api/node_modules")){
    console.log("Install all package.");
    execSync("npm install", {cwd: "/api", stdio: "ignore"});
    execSync("chown -R node . && chgrp -R node .", {stdio: "ignore"});
}

console.log("Starting anotherback");

class child{
    static start(){
        this.process = spawn("npx", ["aob"], {stdio: "inherit", uid: 1000, gid: 1000, cwd: "/api", detached: true});
        this.watcher = new Watcher("/api/node_modules").on("unlinkDir", () => child.restart());
    }

    static stop(){
        this.watcher.close();
        process.kill(this.process.pid, "SIGINT");
    }

    static restart(){
        this.stop();
        console.log("Starting reinstall all package");
        execSync("npm install", {stdio: "ignore", cwd: "/api"});
        execSync("chown -R node ./node_modules && chgrp -R node ./node_modules", {stdio: "ignore", cwd: "/api"});
        this.start();
    }

    static process;
    static watcher
}

child.start();