
(function () {
  const KEY = "navCount";
  const badge = document.getElementById("counterBadge");
  const btnConnect = document.getElementById("btnConnect");

  const DIR_KEY = "directionCheck";
const getDir  = () => (sessionStorage.getItem(DIR_KEY) ?? "true") === "true";
const setDir  = (v) => sessionStorage.setItem(DIR_KEY, v ? "true" : "false")
  let directionCheck = true;
  const Counter = {
    get: () => parseInt(sessionStorage.getItem(KEY) ?? "0", 10) || 0,
    set(v) {
      sessionStorage.setItem(KEY, String(v));
      if (badge) badge.textContent = v;
    },
    inc() {
      this.set(this.get() + 1);
    },
    reset() {
      this.set(0);
    },
  };
  if (sessionStorage.getItem(KEY) == null) Counter.set(0);
  if (sessionStorage.getItem(DIR_KEY) == null) setDir(true);
  else Counter.set(Counter.get());

  const Serial = {
    port: null, reader: null, writer: null, listeners: [],
    async connect(request = false) {
      try {
        this.port = request ? await navigator.serial.requestPort()
                            : (await navigator.serial.getPorts())[0];
        if (!this.port) { console.warn("No saved port"); return false; }
        await this.port.open({ baudRate: 115200 });
        this.writer = this.port.writable.getWriter();

        // read loop (optional)
        const td = new TextDecoderStream();
        this.port.readable.pipeTo(td.writable);
        this.pipe = this.port.readable.pipeTo(td.writable);
        this.reader = td.readable.getReader();
        (async () => {
          let buf = "";
          while (true) {
            const { value, done } = await this.reader.read();
            if (done) break;
            buf += value;
            const lines = buf.split("\n"); buf = lines.pop() ?? "";
            for (const ln of lines) console.log("[RX]", ln.replace(/\r$/, ""));
            this.listeners.forEach(fn => { try { fn(ln); } catch(e){} });
          }
        })();

        console.log("✅ Serial connected");
        return true;
      } catch (e) {
        console.error("Serial error:", e);
        return false;
      }
    },
  async disconnect() {
    try { await this.reader?.cancel(); } catch {}
    try { await this.pipe; } catch {}
    try { this.reader?.releaseLock(); } catch {}
    try { this.writer?.releaseLock(); } catch {}
    try { await this.port?.close(); } catch {}
    this.reader = this.writer = this.port = this.pipe = null;
  },

  async sendLine(s) {
    if (!this.writer) throw new Error("Not connected");
    await this.writer.write(new TextEncoder().encode(s));
  },

  waitForLine(target, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { off(); reject(new Error("Timeout waiting for: " + target)); }, timeoutMs);
      const handler = (line) => {
        if (line.includes(target)) { clearTimeout(timer); off(); resolve(line); }
      };
      const off = () => {
        const i = this.listeners.indexOf(handler);
        if (i >= 0) this.listeners.splice(i, 1);
      };
      this.listeners.push(handler);
    });
  }
};
  if (navigator.serial) {
    Serial.connect(false);
    navigator.serial.addEventListener("disconnect", () => {
      console.warn("USB disconnected");
      Serial.disconnect();
    });
  }

  btnConnect?.addEventListener("click", () => Serial.connect(true));

  async function functionOne() {
    console.log("functionOne()");
    await Serial.sendLine("1"); 
  }
  async function functionTwo(url) {
  console.log("functionTwo()");
  const dir = getDir(); 

  if (dir) {
     sendCommandAndWaitThenGo("4", url);
  } else {
     sendCommandAndWaitThenGo("5", url);
  }

  setDir(!dir);
}

  // ---- 카운트 + 훅 실행 ----
  async function handleCountAndHooks(url) {
    Counter.inc();
    const n = Counter.get();
    if (n < 6) {
      await functionOne(); 
      window.location.href = url;  
    }else{
      await functionTwo(url);
      Counter.reset();
    }
  }

// const coverDiv = document.querySelector('.coverDiv');
async function sendCommandAndWaitThenGo(cmd, url) {
  const donePromise = Serial.waitForLine("DONE", 60000);
  // coverDiv.style.display ="block";
  await Serial.sendLine(cmd);
  await donePromise;   
  window.location.href = url;
}


  document.addEventListener("click", async (e) => {
    const link = e.target.closest('a[data-role="next"], a[data-role="prev"]');
    if (!link) return;
    e.preventDefault(); // 이동 전에 훅/시리얼 실행
    const next = e.target.closest('a[data-role="next"]');
    const prev = e.target.closest('a[data-role="prev"]');
    const url = (next || prev).href;
    await handleCountAndHooks(url);

  });

  let hitBtn1 = document.querySelector(".hit1");
  let hitBtn2 = document.querySelector(".hit2");
  let hitBtn3 = document.querySelector(".hit3");
  let hitBtn4 = document.querySelector(".hit4");
  let hitBtn5 = document.querySelector(".hit5");

  hitBtn1.addEventListener('click', () => {
    Serial.sendLine("1");
  });
  hitBtn2.addEventListener('click', () => {
    Serial.sendLine("2");
  });
  hitBtn3.addEventListener('click', () => {
    Serial.sendLine("3");
  });
  hitBtn4.addEventListener('click', () => {
    Serial.sendLine("6");
  });
  hitBtn5.addEventListener('click', () => {
    Serial.sendLine("7");
  });

  window.navCounter = {
    get: () => Counter.get(),
    reset: () => Counter.reset(),
  };

  window.addEventListener('load', () => {
    const coverDiv = document.querySelector('.coverDiv');
    coverDiv.style.display = 'flex';    
    setTimeout(() => {
          coverDiv.style.display = 'none';
    }, 2000);
  });
    
})();
