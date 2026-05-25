(() => {
  // Theme switch
  const body = document.body;
  const lamp = document.getElementById("mode");

  const toggleTheme = (state) => {
    if (state === "dark") {
      localStorage.setItem("theme", "light");
      body.removeAttribute("data-theme");
    } else if (state === "light") {
      localStorage.setItem("theme", "dark");
      body.setAttribute("data-theme", "dark");
    } else {
      initTheme(state);
    }
  };

  lamp.addEventListener("click", (e) => {
    const currentTheme = body.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    
    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";
    
    const rect = lamp.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.style.backgroundColor = nextTheme === "dark" ? "#131418" : "#ffffff";
    
    body.appendChild(ripple);
    
    setTimeout(() => {
      if (nextTheme === "dark") {
        localStorage.setItem("theme", "dark");
        body.setAttribute("data-theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
        body.removeAttribute("data-theme");
      }
      
      setTimeout(() => {
        ripple.remove();
      }, 500);
    }, 200);
  });

  // Blur the content when the menu is open
  const cbox = document.getElementById("menu-trigger");

  cbox.addEventListener("change", function () {
    const area = document.querySelector(".wrapper");
    this.checked
      ? area.classList.add("blurry")
      : area.classList.remove("blurry");
  });

  // Typing effect on Homepage
  const typingElement = document.getElementById("typing-element");
  if (typingElement) {
    const words = ["Software Engineer", "Distributed Systems Specialist", "NYU Courant Graduate"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 40 : 80;
      
      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }
      
      setTimeout(type, typeSpeed);
    };
    
    setTimeout(type, 1000);
  }

  // Scroll Progress Indicator
  const scrollIndicator = document.getElementById("scroll-progress-indicator");
  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollIndicator.style.width = scrolled + "%";
    });
  }

  // Live GitHub Stats Caching Fetcher
  const repos = document.querySelectorAll(".project-github-stats");
  if (repos.length > 0) {
    repos.forEach((el) => {
      const repoName = el.getAttribute("data-repo");
      if (!repoName) return;
      
      const cacheKey = `gh-stats-${repoName}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      const updateStats = (stars, forks) => {
        const starEl = el.querySelector(".gh-stars .gh-count");
        const forkEl = el.querySelector(".gh-forks .gh-count");
        if (starEl) starEl.textContent = stars;
        if (forkEl) forkEl.textContent = forks;
      };
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const age = Date.now() - parsed.timestamp;
        if (age < 3600000) {
          updateStats(parsed.stars, parsed.forks);
          return;
        }
      }
      
      fetch(`https://api.github.com/repos/${repoName}`)
        .then((res) => {
          if (!res.ok) throw new Error("GitHub Limit reached");
          return res.json();
        })
        .then((data) => {
          const stars = data.stargazers_count;
          const forks = data.forks_count;
          updateStats(stars, forks);
          localStorage.setItem(cacheKey, JSON.stringify({
            stars,
            forks,
            timestamp: Date.now()
          }));
        })
        .catch((err) => {
          console.warn("GitHub Stats Load Error: ", err);
          updateStats(0, 0);
        });
    });
  }

  // Experience Accordion Slide Toggler
  const accordions = document.querySelectorAll(".expandable-experience");
  if (accordions.length > 0) {
    accordions.forEach((el) => {
      el.addEventListener("click", (e) => {
        // Prevent toggling if user clicks an actual link inside the accordion
        if (e.target.closest("a")) return;

        const isOpen = el.classList.contains("exp-open");
        
        // Optional: close other experience accordions for a clean single-open accordion feel
        accordions.forEach((other) => {
          other.classList.remove("exp-open");
          const otherContent = other.querySelector(".experience-details-content");
          if (otherContent) otherContent.style.maxHeight = null;
        });
        
        const content = el.querySelector(".experience-details-content");
        if (content) {
          if (isOpen) {
            el.classList.remove("exp-open");
            content.style.maxHeight = null;
          } else {
            el.classList.add("exp-open");
            content.style.maxHeight = content.scrollHeight + "px";
          }
        }
      });
    });
  }

  // Publications BibTeX Citation Copy Trigger
  const citationBtns = document.querySelectorAll(".pub-citation-btn");
  if (citationBtns.length > 0) {
    citationBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const bibtex = btn.getAttribute("data-bibtex");
        if (!bibtex) return;

        navigator.clipboard.writeText(bibtex)
          .then(() => {
            const btnText = btn.querySelector(".btn-text");
            const originalText = btnText.textContent;
            btnText.textContent = "Copied! ✓";
            btn.classList.add("citation-copied");

            setTimeout(() => {
              btnText.textContent = originalText;
              btn.classList.remove("citation-copied");
            }, 2000);
          })
          .catch((err) => {
            console.error("BibTeX copy failed: ", err);
          });
      });
    });
  }

  // ==========================================================================
  // Redesign Redirection Redux: Raft Consensus Lab Simulation
  // ==========================================================================
  const raftCanvas = document.getElementById("raft-canvas");
  if (raftCanvas) {
    const ctx = raftCanvas.getContext("2d");
    const logContainer = document.getElementById("raft-log");
    const btnReset = document.getElementById("btn-raft-reset");
    const btnPartition = document.getElementById("btn-raft-partition");

    let nodes = [];
    let packets = [];
    let isPartitioned = false;
    let animId = null;
    let lastTime = performance.now();

    // Node configuration parameters
    const nodeIds = [1, 2, 3, 4, 5];
    const states = { LEADER: "leader", CANDIDATE: "candidate", FOLLOWER: "follower", OFFLINE: "offline" };
    const colors = {
      leader: "#1DB954",    // Spotify Green
      candidate: "#3572A5", // GitHub Python Blue
      follower: "#767f87",  // Gray Muted
      offline: "#ff2957"    // Highlight Red
    };

    const addLog = (text) => {
      if (!logContainer) return;
      const el = document.createElement("div");
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;
      el.textContent = `${timeStr} ${text}`;
      logContainer.appendChild(el);
      logContainer.scrollTop = logContainer.scrollHeight;
      // Cap log history
      while (logContainer.children.length > 30) {
        logContainer.removeChild(logContainer.firstChild);
      }
    };

    class RaftNode {
      constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 22;
        this.resetElectionTimeout();
        this.state = states.FOLLOWER;
        this.term = 1;
        this.votedFor = null;
        this.votesReceived = new Set();
        this.heartbeatTimer = 0;
        this.hbInterval = 1200; // ms
        this.flashTimer = 0; // Visual ping indicator
      }

      resetElectionTimeout() {
        // Random timeout between 3500ms and 5500ms to avoid split votes
        this.electionTimeout = 3500 + Math.random() * 2000;
        this.electionTimer = 0;
      }

      crash() {
        this.state = states.OFFLINE;
        this.votedFor = null;
        this.votesReceived.clear();
        addLog(`Node ${this.id} crashed offline.`);
      }

      recover() {
        this.state = states.FOLLOWER;
        this.resetElectionTimeout();
        addLog(`Node ${this.id} recovered. Rejoining cluster as follower.`);
      }

      update(dt) {
        if (this.state === states.OFFLINE) return;

        if (this.flashTimer > 0) this.flashTimer -= dt;

        // Follower / Candidate election countdowns
        if (this.state === states.FOLLOWER || this.state === states.CANDIDATE) {
          this.electionTimer += dt;
          if (this.electionTimer >= this.electionTimeout) {
            this.startElection();
          }
        }

        // Leader heartbeats
        if (this.state === states.LEADER) {
          this.heartbeatTimer += dt;
          if (this.heartbeatTimer >= this.hbInterval) {
            this.sendHeartbeats();
            this.heartbeatTimer = 0;
            this.flashTimer = 200; // Visual heartbeat flash
          }
        }
      }

      startElection() {
        this.state = states.CANDIDATE;
        this.term += 1;
        this.votedFor = this.id;
        this.votesReceived.clear();
        this.votesReceived.add(this.id);
        this.resetElectionTimeout();
        addLog(`Node ${this.id} timed out. Initiating election for term ${this.term}.`);

        // Broadcast RequestVote RPCs
        nodes.forEach(node => {
          if (node.id !== this.id && node.state !== states.OFFLINE) {
            sendPacket(this, node, "requestVote", this.term);
          }
        });
      }

      sendHeartbeats() {
        nodes.forEach(node => {
          if (node.id !== this.id && node.state !== states.OFFLINE) {
            sendPacket(this, node, "heartbeat", this.term);
          }
        });
      }

      receivePacket(packet) {
        if (this.state === states.OFFLINE) return;

        // Drop packets across network partition boundary
        if (isPartitioned) {
          const inGroupA = (n) => n === 1 || n === 2;
          if (inGroupA(packet.from.id) !== inGroupA(this.id)) {
            return; // Dropped in partition wall
          }
        }

        // Rule: If term in packet is higher, step down immediately to follower
        if (packet.term > this.term) {
          this.term = packet.term;
          if (this.state !== states.FOLLOWER) {
            this.state = states.FOLLOWER;
            addLog(`Node ${this.id} observed higher term ${packet.term} in packet. Stepped down to Follower.`);
          }
          this.votedFor = null;
          this.resetElectionTimeout();
        }

        if (packet.type === "requestVote") {
          // Grant vote if packet term is equal to mine and we haven't voted or voted for them
          const canVote = (packet.term === this.term) && (this.votedFor === null || this.votedFor === packet.from.id);
          if (canVote) {
            this.votedFor = packet.from.id;
            this.resetElectionTimeout(); // Reset timeout upon granting vote
            sendPacket(this, packet.from, "voteResponse", this.term, true);
            addLog(`Node ${this.id} voted for Node ${packet.from.id} in term ${this.term}.`);
          } else {
            sendPacket(this, packet.from, "voteResponse", this.term, false);
          }
        } 
        
        else if (packet.type === "voteResponse") {
          if (this.state === states.CANDIDATE && packet.term === this.term && packet.success) {
            this.votesReceived.add(packet.from.id);
            // Count active nodes in partition / cluster to see if we reached a majority
            const activeNodesInNetworkCount = isPartitioned 
              ? (packet.from.id === 1 || packet.from.id === 2 ? 2 : 3)
              : nodes.filter(n => n.state !== states.OFFLINE).length;
            
            // Majority of entire cluster (3 out of 5) is standard Raft rules
            if (this.votesReceived.size >= 3) {
              this.state = states.LEADER;
              this.heartbeatTimer = this.hbInterval; // Broadcast heartbeats immediately
              addLog(`Node ${this.id} received majority votes (${this.votesReceived.size}/5). Established as LEADER for term ${this.term}!`);
            }
          }
        } 
        
        else if (packet.type === "heartbeat") {
          if (packet.term === this.term) {
            if (this.state === states.CANDIDATE) {
              this.state = states.FOLLOWER;
              addLog(`Node ${this.id} stepped down. Recognized Leader ${packet.from.id} heartbeats.`);
            }
            this.resetElectionTimeout(); // Reset timer upon receiving heartbeat
            this.flashTimer = 150; // Follower visual sync ping
          }
        }
      }
    }

    class Packet {
      constructor(from, to, type, term, success = false) {
        this.from = from;
        this.to = to;
        this.type = type;
        this.term = term;
        this.success = success;
        this.progress = 0;
        this.speed = 0.003; // progress speed per millisecond
      }

      update(dt) {
        this.progress += this.speed * dt;
        if (this.progress >= 1) {
          this.progress = 1;
          this.to.receivePacket(this);
          return true; // Finished
        }
        return false;
      }

      draw() {
        // Drop drawing if partitioned
        if (isPartitioned) {
          const inGroupA = (n) => n === 1 || n === 2;
          if (inGroupA(this.from.id) !== inGroupA(this.to.id)) return;
        }

        const dx = this.to.x - this.from.x;
        const dy = this.to.y - this.from.y;
        const px = this.from.x + dx * this.progress;
        const py = this.from.y + dy * this.progress;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        if (this.type === "heartbeat") {
          ctx.fillStyle = colors.leader;
        } else if (this.type === "requestVote") {
          ctx.fillStyle = colors.candidate;
        } else if (this.type === "voteResponse") {
          ctx.fillStyle = this.success ? "#ffeb3b" : "#757575";
        } else {
          ctx.fillStyle = "#ffffff";
        }
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    const sendPacket = (from, to, type, term, success = false) => {
      packets.push(new Packet(from, to, type, term, success));
    };

    // Arrange 5 nodes in a neat circle
    const initCluster = () => {
      nodes = [];
      packets = [];
      const cx = raftCanvas.width / 2;
      const cy = raftCanvas.height / 2;
      const radius = 80;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        nodes.push(new RaftNode(i + 1, x, y));
      }
    };

    const resizeCanvas = () => {
      // Get display dimensions
      const rect = raftCanvas.getBoundingClientRect();
      raftCanvas.width = rect.width;
      raftCanvas.height = rect.height;
      initCluster();
    };

    // Handle mouse clicking to crash/online nodes
    raftCanvas.addEventListener("click", (e) => {
      const rect = raftCanvas.getBoundingClientRect();
      // Calculate coordinates relative to canvas internal coordinate space
      const scaleX = raftCanvas.width / rect.width;
      const scaleY = raftCanvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      nodes.forEach(node => {
        const dist = Math.hypot(node.x - mx, node.y - my);
        if (dist <= node.radius + 5) {
          if (node.state === states.OFFLINE) {
            node.recover();
          } else {
            node.crash();
          }
        }
      });
    });

    btnReset.addEventListener("click", () => {
      initCluster();
      isPartitioned = false;
      btnPartition.classList.remove("citation-copied");
      btnPartition.textContent = "Simulate Partition";
      addLog("[System] Cluster reset. Term counters restarted at term 1.");
    });

    btnPartition.addEventListener("click", () => {
      isPartitioned = !isPartitioned;
      if (isPartitioned) {
        btnPartition.classList.add("citation-copied");
        btnPartition.textContent = "Heal Partition";
        addLog("[Network] Simulated partition splits nodes: [Node 1, Node 2] disconnected from [Node 3, Node 4, Node 5].");
      } else {
        btnPartition.classList.remove("citation-copied");
        btnPartition.textContent = "Simulate Partition";
        addLog("[Network] Disconnected nodes healed. Communication networks converged.");
      }
    });

    const loop = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, raftCanvas.width, raftCanvas.height);

      // Draw active communication lines
      nodes.forEach(nodeA => {
        nodes.forEach(nodeB => {
          if (nodeA.id < nodeB.id) {
            let activeComm = true;
            if (isPartitioned) {
              const inGroupA = (n) => n === 1 || n === 2;
              if (inGroupA(nodeA.id) !== inGroupA(nodeB.id)) activeComm = false;
            }

            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.lineWidth = 1;
            if (activeComm) {
              ctx.strokeStyle = "rgba(128,128,128,0.15)";
              ctx.setLineDash([3, 3]);
            } else {
              ctx.strokeStyle = "rgba(255,41,87,0.1)";
              ctx.setLineDash([1, 6]);
            }
            ctx.stroke();
            ctx.setLineDash([]); // Reset
          }
        });
      });

      // Draw partition barrier wall
      if (isPartitioned) {
        ctx.beginPath();
        // A wall splitting nodes 1/2 from 3/4/5
        ctx.moveTo(0, raftCanvas.height * 0.45);
        ctx.lineTo(raftCanvas.width, raftCanvas.height * 0.45);
        ctx.strokeStyle = "rgba(255, 41, 87, 0.4)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255, 41, 87, 0.6)";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("PARTITION WALL (SPLIT BRAIN)", 15, raftCanvas.height * 0.42);
      }

      // Update and draw packets
      packets = packets.filter(p => !p.update(dt));
      packets.forEach(p => p.draw());

      // Update and draw nodes
      nodes.forEach(node => {
        node.update(dt);

        // Visual flash rings
        if (node.flashTimer > 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.strokeStyle = node.state === states.LEADER ? "rgba(29, 185, 84, 0.25)" : "rgba(128, 128, 128, 0.2)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Base ring outline
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius);
        ctx.fillStyle = colors[node.state] || colors.follower;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = node.state === states.LEADER ? 12 : 3;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Election timeout progress ring
        if (node.state === states.FOLLOWER || node.state === states.CANDIDATE) {
          const ratio = Math.min(1, node.electionTimer / node.electionTimeout);
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, -Math.PI / 2, -Math.PI / 2 + ratio * 2 * Math.PI);
          ctx.strokeStyle = "rgba(128, 128, 128, 0.35)";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Node ID and Term Text Labels
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`S${node.id}`, node.x, node.y - 4);
        
        ctx.font = "9px Consolas, monospace";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillText(`T${node.term}`, node.x, node.y + 7);
      });

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animId = requestAnimationFrame(loop);
  }

  // ==========================================================================
  // Redesign Redirection Redux: Spotify & Goodreads Dynamic Widgets
  // ==========================================================================
  const spotifyTrack = document.getElementById("spotify-track");
  const readingBook = document.getElementById("reading-book");

  if (spotifyTrack && readingBook) {
    const playlists = [
      '"Gymnopédie No.1" — Erik Satie',
      '"Clair de Lune" — Claude Debussy',
      '"Resonance" — HOME',
      '"Space Oddity" — David Bowie',
      '"Time" — Pink Floyd',
      '"Reflections" — Toshifumi Hinata'
    ];

    const books = [
      "Designing Data-Intensive Applications",
      "Database Internals — Alex Petrov",
      "Distributed Systems: Principles and Paradigms",
      "Understanding LSTM Networks — Colah",
      "Introduction to Algorithms (CLRS)"
    ];

    let trackIdx = 0;
    let bookIdx = 0;

    const rotateWidgets = () => {
      // Spotify track crossfade animation
      spotifyTrack.style.opacity = 0;
      setTimeout(() => {
        trackIdx = (trackIdx + 1) % playlists.length;
        spotifyTrack.textContent = playlists[trackIdx];
        spotifyTrack.style.opacity = 1;
      }, 500);

      // Book crossfade animation
      readingBook.style.opacity = 0;
      setTimeout(() => {
        bookIdx = (bookIdx + 1) % books.length;
        readingBook.textContent = books[bookIdx];
        readingBook.style.opacity = 1;
      }, 500);
    };

    // Set transition styles
    spotifyTrack.style.transition = "opacity 0.5s ease";
    readingBook.style.transition = "opacity 0.5s ease";

    // Rotate every 12 seconds
    setInterval(rotateWidgets, 12000);
  }
})();
