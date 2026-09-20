const steps = [
  {
    title: "PCからルーターへ",
    action: "ルーターへ送信",
    src: "192.168.1.10",
    explanation:
      "PCは宛先「198.51.100.20」を見て、家庭内LANの外にあると判断します。そこで、家庭用ルーターへパケットを渡します。"
  },
  {
    title: "ルーターが経路を判断",
    action: "ルーティング",
    src: "192.168.1.10",
    explanation:
      "ルーターは宛先IPアドレス「198.51.100.20」を見て、どのネットワークへ転送するかを判断します。これがルーティングです。"
  },
  {
    title: "NATでIPアドレスを変換",
    action: "NAT",
    src: "203.0.113.10",
    explanation:
      "家庭内の送信元IP「192.168.1.10」を、インターネット側から見える「203.0.113.10」に変換します。NATは「アドレスを変換する」仕組みです。"
  },
  {
    title: "インターネット上のルーターへ",
    action: "次のルーターへ転送",
    src: "203.0.113.10",
    explanation:
      "インターネット上の途中のルーターも、宛先IPを見て次のネットワークへパケットを転送します。"
  },
  {
    title: "宛先ネットワークへ",
    action: "宛先へ転送",
    src: "203.0.113.10",
    explanation:
      "パケットがWebサーバー側のネットワークまで到着しました。ルーターが道案内を繰り返して、目的地に近づいていきます。"
  },
  {
    title: "Webサーバーに到着",
    action: "到着",
    src: "203.0.113.10",
    explanation:
      "Webサーバー「198.51.100.20」に到着しました。このように、ルーティングは「どこへ送るか」、NATは「IPアドレスを変換すること」に関係します。"
  }
];

const packet = document.getElementById("packet");
const srcIp = document.getElementById("srcIp");
const currentAction = document.getElementById("currentAction");
const explanation = document.getElementById("explanation");
const stepCounter = document.getElementById("stepCounter");
const routeStatus = document.getElementById("routeStatus");

const nodes = [
  document.getElementById("pcNode"),
  document.getElementById("routerNode"),
  document.getElementById("routerNode"),
  document.getElementById("ispNode"),
  document.getElementById("ispNode"),
  document.getElementById("serverNode")
];

const links = [
  document.getElementById("link1"),
  document.getElementById("link1"),
  document.getElementById("link2"),
  document.getElementById("link2"),
  document.getElementById("link3"),
  document.getElementById("link3")
];

let currentStep = 0;
let timer = null;

function setPacketPosition(step) {
  // PC → 家庭用ルーター → 途中のルーター → Webサーバー
  const positions = [
    { left: "10%", top: "52%" },
    { left: "34%", top: "52%" },
    { left: "34%", top: "52%" },
    { left: "60%", top: "52%" },
    { left: "60%", top: "52%" },
    { left: "90%", top: "52%" }
  ];

  const pos = positions[step];
  packet.style.left = pos.left;
  packet.style.top = pos.top;
}

function renderStep(step) {
  const data = steps[step];

  srcIp.textContent = data.src;
  currentAction.textContent = data.action;
  explanation.textContent = data.explanation;
  stepCounter.textContent = `${step} / ${steps.length - 1}`;

  document.querySelectorAll(".node").forEach(node => {
    node.classList.remove("active", "nat-active");
  });

  document.querySelectorAll(".link").forEach(link => {
    link.classList.remove("active");
  });

  nodes[step].classList.add("active");

  if (step > 0) {
    links[step].classList.add("active");
  }

  if (step === 2) {
    document.getElementById("routerNode").classList.add("nat-active");
    packet.classList.add("nat");
    setTimeout(() => packet.classList.remove("nat"), 900);
  }

  setPacketPosition(step);

  if (step === 0) {
    routeStatus.textContent = "送信開始";
    routeStatus.className = "route-status running";
  } else if (step === steps.length - 1) {
    routeStatus.textContent = "到着！";
    routeStatus.className = "route-status done";
  } else {
    routeStatus.textContent = data.action;
    routeStatus.className = "route-status running";
  }
}

function reset() {
  clearInterval(timer);
  timer = null;
  currentStep = 0;

  packet.classList.remove("show", "nat");
  packet.style.left = "7%";
  packet.style.top = "52%";

  srcIp.textContent = "192.168.1.10";
  currentAction.textContent = "待機中";
  explanation.textContent =
    "「パケットを送る」を押すと、PCからWebサーバーまでの旅が始まります。";
  stepCounter.textContent = "0 / 6";
  routeStatus.textContent = "待機中";
  routeStatus.className = "route-status";

  document.querySelectorAll(".node").forEach(node => {
    node.classList.remove("active", "nat-active");
  });

  document.querySelectorAll(".link").forEach(link => {
    link.classList.remove("active");
  });
}

function nextStep() {
  packet.classList.add("show");

  if (currentStep < steps.length - 1) {
    currentStep += 1;
    renderStep(currentStep);
  } else {
    clearInterval(timer);
    timer = null;
  }
}

function startSimulation() {
  reset();
  packet.classList.add("show");
  renderStep(0);

  timer = setInterval(() => {
    if (currentStep < steps.length - 1) {
      currentStep += 1;
      renderStep(currentStep);
    } else {
      clearInterval(timer);
      timer = null;
    }
  }, 1500);
}

document.getElementById("startBtn").addEventListener("click", startSimulation);
document.getElementById("stepBtn").addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  nextStep();
});
document.getElementById("resetBtn").addEventListener("click", reset);

document.querySelectorAll("#quizOptions button").forEach(button => {
  button.addEventListener("click", () => {
    const result = document.getElementById("quizResult");
    document.querySelectorAll("#quizOptions button").forEach(btn => {
      btn.classList.remove("correct", "wrong");
    });

    if (button.dataset.answer === "correct") {
      button.classList.add("correct");
      result.textContent = "正解！ ルーティングは「どこへ転送するか」を判断する仕組みです。";
      result.style.color = "var(--green)";
    } else {
      button.classList.add("wrong");
      result.textContent = "もう一度考えてみよう。「アドレスを変換する」のはNATです。";
      result.style.color = "var(--red)";
    }
  });
});

reset();
