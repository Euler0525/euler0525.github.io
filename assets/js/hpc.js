(function () {
    "use strict";

    var categories = [
        {
            id: "core",
            label: "核心订阅",
            description: "日常信息流：行业新闻、深度分析、技术博客与论文"
        },
        {
            id: "software",
            label: "开源软件",
            description: "直接追踪调度、通信、构建和可移植性工具的发布"
        },
        {
            id: "architecture",
            label: "硬件与系统",
            description: "CPU、GPU、加速器、系统平台与厂商技术路线"
        },
        {
            id: "standards",
            label: "标准与互连",
            description: "编程模型、内存一致性、网络和存储标准"
        },
        {
            id: "benchmarks",
            label: "榜单与基准",
            description: "性能、能效、存储与真实工作负载的交叉验证"
        },
        {
            id: "centers",
            label: "超算中心",
            description: "真实系统部署、移植指南、科研应用与运行经验"
        },
        {
            id: "conferences",
            label: "会议与社区",
            description: "HPC、体系结构、并行计算与芯片技术的重要窗口"
        }
    ];

    var resources = [
        {
            category: "core",
            name: "HPCwire",
            url: "https://www.hpcwire.com/",
            feed: "https://www.hpcwire.com/feed/",
            kind: "行业媒体",
            description: "覆盖 HPC 产业、科研应用、系统部署、处理器、网络和存储。",
            tags: ["新闻", "产业", "Exascale"],
            featured: true
        },
        {
            category: "core",
            name: "insideHPC",
            url: "https://insidehpc.com/",
            feed: "https://insidehpc.com/feed/",
            kind: "行业媒体",
            description: "超算、HPC-AI、云 HPC、量子计算和高性能数据分析资讯。",
            tags: ["新闻", "HPC-AI", "Cloud HPC"],
            featured: true
        },
        {
            category: "core",
            name: "The Next Platform",
            url: "https://www.nextplatform.com/",
            feed: "https://www.nextplatform.com/feed/",
            kind: "深度分析",
            description: "CPU、GPU、内存、互连及大型数据中心架构的深度产业分析。",
            tags: ["体系结构", "芯片", "数据中心"],
            featured: true
        },
        {
            category: "core",
            name: "HPC.social",
            url: "https://hpc.social/personal-blog/",
            feed: "https://hpc.social/personal-blog/feed.xml",
            kind: "社区聚合",
            description: "聚合 HPC 从业者、研究人员与开发者的个人技术博客。",
            tags: ["社区", "实践", "博客"]
        },
        {
            category: "core",
            name: "NVIDIA HPC Technical Blog",
            url: "https://developer.nvidia.com/blog/tag/hpc/",
            feed: "https://developer.nvidia.com/blog/tag/hpc/feed/",
            kind: "厂商技术",
            description: "CUDA、NCCL、NVSHMEM、HPC SDK、GPU 集群和科学计算优化。",
            tags: ["CUDA", "GPU", "NCCL"]
        },
        {
            category: "core",
            name: "AMD ROCm Blog",
            url: "https://rocm.blogs.amd.com/",
            feed: "https://rocm.blogs.amd.com/blog/atom.xml",
            kind: "厂商技术",
            description: "ROCm、AMD Instinct、HIP、GPU 内核和应用性能优化。",
            tags: ["ROCm", "Instinct", "HIP"]
        },
        {
            category: "core",
            name: "arXiv · cs.DC",
            url: "https://arxiv.org/list/cs.DC/recent",
            feed: "https://rss.arxiv.org/rss/cs.DC",
            kind: "论文",
            description: "分布式、并行与集群计算方向的最新预印本。",
            tags: ["分布式", "并行计算", "论文"]
        },
        {
            category: "core",
            name: "arXiv · cs.PF",
            url: "https://arxiv.org/list/cs.PF/recent",
            feed: "https://rss.arxiv.org/rss/cs.PF",
            kind: "论文",
            description: "计算性能、性能分析、建模与优化方向的最新预印本。",
            tags: ["性能优化", "Profiling", "论文"]
        },
        {
            category: "core",
            name: "arXiv · cs.AR",
            url: "https://arxiv.org/list/cs.AR/recent",
            feed: "https://rss.arxiv.org/rss/cs.AR",
            kind: "论文",
            description: "计算机体系结构、处理器和存储层次方向的最新预印本。",
            tags: ["体系结构", "处理器", "论文"]
        },
        {
            category: "core",
            name: "ALCF News",
            url: "https://www.alcf.anl.gov/news",
            feed: "https://www.alcf.anl.gov/news/rss.xml",
            kind: "超算中心",
            description: "Aurora、Exascale 软件栈、科研应用和系统运行实践。",
            tags: ["Aurora", "Exascale", "实践"]
        },

        {
            category: "benchmarks",
            name: "TOP500 / Green500",
            url: "https://top500.org/",
            kind: "综合榜单",
            description: "跟踪 HPL 性能、全球超级计算机系统架构和能效趋势。",
            tags: ["HPL", "能效", "系统排名"],
            featured: true
        },
        {
            category: "benchmarks",
            name: "HPCG Benchmark",
            url: "https://www.hpcg-benchmark.org/",
            kind: "计算基准",
            description: "侧重内存访问、节点间通信及更接近真实应用的计算模式。",
            tags: ["HPCG", "内存", "通信"]
        },
        {
            category: "benchmarks",
            name: "Graph500",
            url: "https://graph500.org/",
            kind: "图计算基准",
            description: "评估数据密集型应用和大规模图遍历能力。",
            tags: ["图计算", "BFS", "数据密集"]
        },
        {
            category: "benchmarks",
            name: "IO500",
            url: "https://io500.org/",
            kind: "存储基准",
            description: "评估并行文件系统、元数据和 HPC 存储综合性能。",
            tags: ["存储", "I/O", "文件系统"]
        },
        {
            category: "benchmarks",
            name: "MLCommons Benchmarks",
            url: "https://mlcommons.org/benchmarks/",
            kind: "AI 基准",
            description: "观察 HPC-AI 融合、训练、推理和系统级效率。",
            tags: ["MLPerf", "AI", "训练"]
        },
        {
            category: "benchmarks",
            name: "SPEC HPC 2021",
            url: "https://www.spec.org/hpc2021/",
            kind: "应用基准",
            description: "使用科学计算工作负载评估跨节点 CPU 和加速系统。",
            tags: ["SPEC", "科学计算", "跨节点"]
        },
        {
            category: "benchmarks",
            name: "HPL-MxP",
            url: "https://hpl-mxp.org/",
            kind: "混合精度基准",
            description: "关注混合精度计算和 AI 加速器参与科学计算的能力。",
            tags: ["混合精度", "Tensor Core", "FP64"]
        },

        {
            category: "architecture",
            name: "NVIDIA HPC",
            url: "https://developer.nvidia.com/hpc",
            kind: "GPU 平台",
            description: "GPU 架构、CUDA-X、HPC SDK、网络与加速计算生态。",
            tags: ["GPU", "CUDA-X", "NVLink"]
        },
        {
            category: "architecture",
            name: "AMD ROCm Developer Hub",
            url: "https://www.amd.com/en/developer/resources/rocm-hub.html",
            kind: "GPU 平台",
            description: "AMD GPU 驱动、编译器、数学库、工具及兼容性资料。",
            tags: ["ROCm", "CDNA", "Instinct"]
        },
        {
            category: "architecture",
            name: "Intel Developer",
            url: "https://www.intel.com/content/www/us/en/developer/overview.html",
            kind: "CPU / 加速器",
            description: "Xeon、GPU、oneAPI、编译器与跨架构开发资料。",
            tags: ["Xeon", "oneAPI", "SYCL"]
        },
        {
            category: "architecture",
            name: "Arm Community",
            url: "https://community.arm.com/",
            kind: "CPU 架构",
            description: "Arm、Neoverse、SVE/SME 与服务器软件生态技术文章。",
            tags: ["Arm", "Neoverse", "SVE"]
        },
        {
            category: "architecture",
            name: "HPE Supercomputing",
            url: "https://www.hpe.com/us/en/supercomputing.html",
            kind: "系统平台",
            description: "HPE Cray 超算系统、Slingshot 互连和液冷平台路线。",
            tags: ["Cray", "Slingshot", "液冷"]
        },
        {
            category: "architecture",
            name: "Fujitsu HPC",
            url: "https://www.fujitsu.com/global/solutions/business-technology/tc/hpc/",
            kind: "系统平台",
            description: "Fugaku、A64FX 与 Arm SVE 科学计算生态。",
            tags: ["Fugaku", "A64FX", "SVE"]
        },
        {
            category: "architecture",
            name: "RISC-V International News",
            url: "https://riscv.org/news/",
            kind: "指令集生态",
            description: "RISC-V 指令集、向量扩展和处理器生态的官方动态。",
            tags: ["RISC-V", "Vector", "ISA"]
        },
        {
            category: "architecture",
            name: "Linux Kernel Archives",
            url: "https://www.kernel.org/",
            kind: "系统软件",
            description: "Linux 内核发布及长期支持版本，是 HPC 系统软件的底座。",
            tags: ["Linux", "Kernel", "NUMA"]
        },

        {
            category: "standards",
            name: "MPI Forum",
            url: "https://www.mpi-forum.org/",
            kind: "编程标准",
            description: "MPI 标准正文、工作组、提案与会议进展。",
            tags: ["MPI", "通信", "并行"]
        },
        {
            category: "standards",
            name: "OpenMP",
            url: "https://www.openmp.org/",
            kind: "编程标准",
            description: "线程、任务、SIMD 与 accelerator offload 标准。",
            tags: ["OpenMP", "Offload", "Task"]
        },
        {
            category: "standards",
            name: "Khronos SYCL",
            url: "https://www.khronos.org/sycl/",
            kind: "编程标准",
            description: "基于现代 C++ 的跨厂商异构计算编程模型。",
            tags: ["SYCL", "C++", "异构计算"]
        },
        {
            category: "standards",
            name: "OpenACC",
            url: "https://www.openacc.org/",
            kind: "编程标准",
            description: "面向 CPU 与 GPU 的指令式加速编程规范和生态。",
            tags: ["OpenACC", "GPU", "Directives"]
        },
        {
            category: "standards",
            name: "CXL Consortium",
            url: "https://computeexpresslink.org/",
            kind: "内存互连",
            description: "设备一致性、内存扩展、共享与池化的关键开放标准。",
            tags: ["CXL", "内存池化", "一致性"]
        },
        {
            category: "standards",
            name: "Ultra Ethernet Consortium",
            url: "https://ultraethernet.org/",
            kind: "网络互连",
            description: "为 AI/HPC scale-out 工作负载优化的开放以太网协议栈。",
            tags: ["UEC", "Ethernet", "Scale-out"]
        },
        {
            category: "standards",
            name: "UALink Consortium",
            url: "https://ualinkconsortium.org/",
            kind: "加速器互连",
            description: "面向加速器 scale-up 连接的开放互连标准。",
            tags: ["UALink", "Scale-up", "加速器"]
        },
        {
            category: "standards",
            name: "InfiniBand Trade Association",
            url: "https://www.infinibandta.org/",
            kind: "网络互连",
            description: "InfiniBand、RoCE 规范及 RDMA 生态标准。",
            tags: ["InfiniBand", "RoCE", "RDMA"]
        },
        {
            category: "standards",
            name: "OpenFabrics Alliance",
            url: "https://www.openfabrics.org/",
            kind: "网络软件",
            description: "OFED、RDMA 软件栈、开放网络接口与社区活动。",
            tags: ["OFED", "RDMA", "Fabric"]
        },
        {
            category: "standards",
            name: "SNIA",
            url: "https://www.snia.org/",
            kind: "存储标准",
            description: "存储、持久内存、数据管理和互操作标准。",
            tags: ["存储", "持久内存", "数据管理"]
        },

        {
            category: "software",
            name: "Slurm",
            url: "https://github.com/SchedMD/slurm",
            feed: "https://github.com/SchedMD/slurm/releases.atom",
            kind: "调度器",
            description: "HPC 集群资源管理与作业调度系统。",
            tags: ["Scheduler", "GPU", "集群"],
            featured: true
        },
        {
            category: "software",
            name: "Spack",
            url: "https://github.com/spack/spack",
            feed: "https://github.com/spack/spack/releases.atom",
            kind: "软件栈",
            description: "面向 HPC 的源码包管理、依赖组合和环境部署。",
            tags: ["Package", "Build", "Environment"],
            featured: true
        },
        {
            category: "software",
            name: "Open MPI",
            url: "https://github.com/open-mpi/ompi",
            feed: "https://github.com/open-mpi/ompi/releases.atom",
            kind: "通信库",
            description: "主流开源 MPI 实现及其运行时与网络组件。",
            tags: ["MPI", "UCX", "通信"],
            featured: true
        },
        {
            category: "software",
            name: "MPICH",
            url: "https://github.com/pmodels/mpich",
            feed: "https://github.com/pmodels/mpich/releases.atom",
            kind: "通信库",
            description: "高可移植、高性能的 MPI 参考实现与研究平台。",
            tags: ["MPI", "CH4", "通信"]
        },
        {
            category: "software",
            name: "UCX",
            url: "https://github.com/openucx/ucx",
            feed: "https://github.com/openucx/ucx/releases.atom",
            kind: "通信框架",
            description: "面向 RDMA、共享内存和加速器的高性能通信框架。",
            tags: ["RDMA", "GPU Direct", "Fabric"]
        },
        {
            category: "software",
            name: "OpenPMIx",
            url: "https://github.com/openpmix/openpmix",
            feed: "https://github.com/openpmix/openpmix/releases.atom",
            kind: "运行时",
            description: "进程管理接口，为调度器和 MPI 运行时提供协同能力。",
            tags: ["PMIx", "Runtime", "Process"]
        },
        {
            category: "software",
            name: "OpenHPC",
            url: "https://github.com/openhpc/ohpc",
            feed: "https://github.com/openhpc/ohpc/releases.atom",
            kind: "集群发行栈",
            description: "构建 HPC 集群所需软件包、组件和部署配方。",
            tags: ["Provisioning", "Cluster", "Repository"]
        },
        {
            category: "software",
            name: "Flux Framework",
            url: "https://github.com/flux-framework/flux-core",
            feed: "https://github.com/flux-framework/flux-core/releases.atom",
            kind: "调度框架",
            description: "面向大规模资源管理的分层作业调度与运行框架。",
            tags: ["Scheduler", "Workflow", "Resource"]
        },
        {
            category: "software",
            name: "Kokkos",
            url: "https://github.com/kokkos/kokkos",
            feed: "https://github.com/kokkos/kokkos/releases.atom",
            kind: "性能可移植性",
            description: "面向多核 CPU 与 GPU 的 C++ 性能可移植编程模型。",
            tags: ["C++", "Portability", "GPU"]
        },
        {
            category: "software",
            name: "LLVM",
            url: "https://github.com/llvm/llvm-project",
            feed: "https://github.com/llvm/llvm-project/releases.atom",
            kind: "编译器",
            description: "Clang、Flang、OpenMP offload 和异构编译基础设施。",
            tags: ["Compiler", "Clang", "Flang"]
        },
        {
            category: "software",
            name: "ROCm",
            url: "https://github.com/ROCm/ROCm",
            feed: "https://github.com/ROCm/ROCm/releases.atom",
            kind: "GPU 软件栈",
            description: "AMD GPU 驱动、编译器、运行时、数学库和工具集合。",
            tags: ["ROCm", "HIP", "GPU"]
        },
        {
            category: "software",
            name: "AdaptiveCpp",
            url: "https://github.com/AdaptiveCpp/AdaptiveCpp",
            feed: "https://github.com/AdaptiveCpp/AdaptiveCpp/releases.atom",
            kind: "异构编程",
            description: "开源 SYCL 实现，支持多种 CPU 与 GPU 后端。",
            tags: ["SYCL", "C++", "Portability"]
        },
        {
            category: "software",
            name: "LLNL RAJA",
            url: "https://github.com/LLNL/RAJA",
            feed: "https://github.com/LLNL/RAJA/releases.atom",
            kind: "性能可移植性",
            description: "LLNL 的 C++ 循环执行和内核可移植抽象。",
            tags: ["C++", "Portability", "LLNL"]
        },
        {
            category: "software",
            name: "LLNL Umpire",
            url: "https://github.com/LLNL/Umpire",
            feed: "https://github.com/LLNL/Umpire/releases.atom",
            kind: "内存管理",
            description: "面向异构 HPC 系统的跨平台内存资源管理库。",
            tags: ["Memory", "GPU", "LLNL"]
        },
        {
            category: "software",
            name: "E4S",
            url: "https://github.com/E4S-Project/e4s",
            feed: "https://github.com/E4S-Project/e4s/releases.atom",
            kind: "软件生态",
            description: "Extreme-scale Scientific Software Stack 的集成与发布。",
            tags: ["Exascale", "Software Stack", "DOE"]
        },

        {
            category: "centers",
            name: "OLCF",
            url: "https://www.olcf.ornl.gov/news/",
            kind: "美国",
            description: "Frontier、领导级计算、用户科学和 Exascale 应用实践。",
            tags: ["Frontier", "ORNL", "Exascale"]
        },
        {
            category: "centers",
            name: "ALCF",
            url: "https://www.alcf.anl.gov/news",
            feed: "https://www.alcf.anl.gov/news/rss.xml",
            kind: "美国",
            description: "Aurora、Polaris、AI for Science 与综合工作流。",
            tags: ["Aurora", "Argonne", "AI for Science"]
        },
        {
            category: "centers",
            name: "NERSC",
            url: "https://www.nersc.gov/news-and-events",
            kind: "美国",
            description: "Perlmutter、科学用户服务、性能工程和数据工作流。",
            tags: ["Perlmutter", "DOE", "Workflow"]
        },
        {
            category: "centers",
            name: "LLNL HPC",
            url: "https://computing.llnl.gov/hpc-news",
            kind: "美国",
            description: "El Capitan、HPC 系统软件、性能可移植性和科学应用。",
            tags: ["El Capitan", "LLNL", "Software"]
        },
        {
            category: "centers",
            name: "EuroHPC JU",
            url: "https://www.eurohpc-ju.europa.eu/",
            kind: "欧洲",
            description: "欧洲超算采购、AI Factories、开放调用和研发项目。",
            tags: ["EuroHPC", "Procurement", "AI Factory"]
        },
        {
            category: "centers",
            name: "ETP4HPC",
            url: "https://etp4hpc.eu/news/",
            kind: "欧洲",
            description: "欧洲 HPC 技术路线、战略研究议程与生态新闻。",
            tags: ["Europe", "Roadmap", "Ecosystem"]
        },
        {
            category: "centers",
            name: "CSCS",
            url: "https://www.cscs.ch/",
            kind: "瑞士",
            description: "Alps 系统、科学计算、GPU 应用和超算基础设施。",
            tags: ["Alps", "Switzerland", "GPU"]
        },
        {
            category: "centers",
            name: "Barcelona Supercomputing Center",
            url: "https://www.bsc.es/news",
            kind: "西班牙",
            description: "MareNostrum、欧洲处理器、RISC-V 和应用研究动态。",
            tags: ["MareNostrum", "BSC", "RISC-V"]
        },
        {
            category: "centers",
            name: "Jülich Supercomputing Centre",
            url: "https://www.fz-juelich.de/en/ias/jsc/news",
            kind: "德国",
            description: "JUPITER、模块化超算、欧洲 Exascale 与性能工具。",
            tags: ["JUPITER", "JSC", "Modular"]
        },
        {
            category: "centers",
            name: "RIKEN R-CCS",
            url: "https://www.r-ccs.riken.jp/en/",
            kind: "日本",
            description: "Fugaku、后 Exascale 研发和计算科学应用。",
            tags: ["Fugaku", "RIKEN", "Post-exascale"]
        },
        {
            category: "centers",
            name: "CCF 高性能计算专委会",
            url: "https://www.ccf.org.cn/Chapters/TC/TC_Listing/TCHPC/",
            kind: "中国",
            description: "国内 HPC 学术活动、HPC China 与专业委员会动态。",
            tags: ["CCF", "HPC China", "学术"]
        },
        {
            category: "centers",
            name: "国家超级计算深圳中心",
            url: "https://www.nsccsz.cn/",
            kind: "中国",
            description: "国产超算系统、行业应用、中心新闻与服务动态。",
            tags: ["深圳", "国产超算", "应用"]
        },
        {
            category: "centers",
            name: "中国科大超级计算中心",
            url: "https://scc.ustc.edu.cn/",
            kind: "中国",
            description: "HPC 用户服务、系统公告、培训与科研计算实践。",
            tags: ["USTC", "用户服务", "培训"]
        },

        {
            category: "conferences",
            name: "SC Conference",
            url: "https://supercomputing.org/",
            kind: "HPC 旗舰会议",
            description: "系统、软件、网络、存储与科学应用的综合旗舰会议。",
            tags: ["SC", "Supercomputing", "Gordon Bell"],
            featured: true
        },
        {
            category: "conferences",
            name: "ISC High Performance",
            url: "https://isc-hpc.com/",
            kind: "HPC 旗舰会议",
            description: "欧洲 HPC 产业、研究、Exascale 与量子融合的重要窗口。",
            tags: ["ISC", "Europe", "Exascale"],
            featured: true
        },
        {
            category: "conferences",
            name: "ISCA",
            url: "https://iscaconf.org/",
            kind: "体系结构",
            description: "计算机体系结构领域旗舰学术会议。",
            tags: ["Architecture", "CPU", "Accelerator"]
        },
        {
            category: "conferences",
            name: "IEEE/ACM MICRO",
            url: "https://www.microarch.org/",
            kind: "微体系结构",
            description: "微体系结构、编译器与软硬件协同研究。",
            tags: ["Microarchitecture", "Compiler", "Hardware"]
        },
        {
            category: "conferences",
            name: "HPCA",
            url: "https://www.hpca-conf.org/",
            kind: "体系结构",
            description: "高性能计算机体系结构及相关系统研究。",
            tags: ["Architecture", "Memory", "Interconnect"]
        },
        {
            category: "conferences",
            name: "ASPLOS",
            url: "https://www.asplos-conference.org/",
            kind: "系统与架构",
            description: "编程语言、操作系统与体系结构交叉研究。",
            tags: ["PL", "OS", "Architecture"]
        },
        {
            category: "conferences",
            name: "PPoPP",
            url: "https://ppopp.org/",
            kind: "并行编程",
            description: "并行编程原理、运行时、编译和性能优化。",
            tags: ["Parallel", "Runtime", "Programming"]
        },
        {
            category: "conferences",
            name: "IPDPS",
            url: "https://www.ipdps.org/",
            kind: "并行与分布式",
            description: "并行与分布式处理、系统和算法研究。",
            tags: ["Distributed", "Parallel", "Systems"]
        },
        {
            category: "conferences",
            name: "ICPP",
            url: "https://www.icpp-conf.org/",
            kind: "并行处理",
            description: "并行计算架构、算法、编程与应用。",
            tags: ["Parallel", "Algorithms", "Applications"]
        },
        {
            category: "conferences",
            name: "IEEE Cluster",
            url: "https://clustercomp.org/",
            kind: "集群计算",
            description: "集群、云、边缘和高性能分布式系统。",
            tags: ["Cluster", "Cloud", "System"]
        },
        {
            category: "conferences",
            name: "HiPC",
            url: "https://hipc.org/",
            kind: "HPC 会议",
            description: "高性能计算、数据和系统研究的国际会议。",
            tags: ["HPC", "Data", "Systems"]
        },
        {
            category: "conferences",
            name: "Hot Chips",
            url: "https://hotchips.org/",
            kind: "芯片会议",
            description: "新处理器、加速器、互连和系统芯片的集中发布窗口。",
            tags: ["Chip", "Accelerator", "Architecture"]
        }
    ];

    var highPriorityResources = [
        "HPCwire",
        "insideHPC",
        "The Next Platform",
        "Slurm",
        "Spack",
        "Open MPI",
        "UCX",
        "ROCm",
        "NVIDIA HPC",
        "AMD ROCm Developer Hub",
        "Intel Developer",
        "MPI Forum",
        "OpenMP",
        "CXL Consortium",
        "InfiniBand Trade Association",
        "TOP500 / Green500",
        "HPCG Benchmark",
        "IO500",
        "OLCF",
        "ALCF",
        "NERSC",
        "LLNL HPC",
        "EuroHPC JU",
        "CCF 高性能计算专委会",
        "SC Conference",
        "ISC High Performance"
    ];

    var mediumPriorityResources = [
        "HPC.social",
        "NVIDIA HPC Technical Blog",
        "AMD ROCm Blog",
        "arXiv · cs.DC",
        "arXiv · cs.PF",
        "arXiv · cs.AR",
        "MPICH",
        "OpenPMIx",
        "OpenHPC",
        "Flux Framework",
        "Kokkos",
        "LLVM",
        "Arm Community",
        "HPE Supercomputing",
        "Khronos SYCL",
        "Ultra Ethernet Consortium",
        "UALink Consortium",
        "OpenFabrics Alliance",
        "MLCommons Benchmarks",
        "CSCS",
        "Barcelona Supercomputing Center",
        "Jülich Supercomputing Centre",
        "RIKEN R-CCS",
        "国家超级计算深圳中心",
        "中国科大超级计算中心",
        "ISCA",
        "IEEE/ACM MICRO",
        "HPCA",
        "ASPLOS",
        "PPoPP",
        "IPDPS",
        "Hot Chips"
    ];

    resources.forEach(function (resource, index) {
        resource.importance = highPriorityResources.indexOf(resource.name) !== -1 ? 3 :
            mediumPriorityResources.indexOf(resource.name) !== -1 ? 2 : 1;
        resource.originalOrder = index;
    });

    var state = {
        category: "all",
        query: ""
    };

    var sectionsElement = document.getElementById("resource-sections");
    var filtersElement = document.getElementById("category-filters");
    var searchInput = document.getElementById("resource-search");
    var resultCount = document.getElementById("result-count");
    var clearSearch = document.getElementById("clear-search");
    var emptyState = document.getElementById("empty-state");
    var emptyReset = emptyState.querySelector("button");
    var themeToggle = document.getElementById("theme-toggle");
    var toast = document.getElementById("toast");
    var backToTop = document.getElementById("back-to-top");
    var toastTimer;

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function countByCategory(categoryId) {
        return resources.filter(function (resource) {
            return resource.category === categoryId;
        }).length;
    }

    function applyTheme(theme) {
        var isLight = theme === "light";
        document.documentElement.dataset.theme = theme;
        themeToggle.innerHTML = isLight
            ? '<i class="fa fa-moon-o" aria-hidden="true"></i>'
            : '<i class="fa fa-sun-o" aria-hidden="true"></i>';
        document.querySelector('meta[name="theme-color"]').content = isLight ? "#f3f1ec" : "#0d0f13";
    }

    function initializeTheme() {
        var savedTheme = localStorage.getItem("theme");
        var preferredTheme = window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        applyTheme(savedTheme || preferredTheme);
    }

    function renderFilters() {
        var buttons = [{
            id: "all",
            label: "全部",
            count: resources.length
        }].concat(categories.map(function (category) {
            return {
                id: category.id,
                label: category.label,
                count: countByCategory(category.id)
            };
        }));

        filtersElement.innerHTML = buttons.map(function (button) {
            return '<button type="button" class="filter-button' +
                (state.category === button.id ? " is-active" : "") +
                '" data-category="' + escapeHtml(button.id) + '">' +
                escapeHtml(button.label) + '<span>' + button.count + "</span></button>";
        }).join("");
    }

    function getFilteredResources() {
        var query = state.query.trim().toLocaleLowerCase();
        return resources.filter(function (resource) {
            var categoryMatch = state.category === "all" || resource.category === state.category;
            var haystack = [
                resource.name,
                resource.description,
                resource.kind,
                resource.tags.join(" "),
                resource.feed || ""
            ].join(" ").toLocaleLowerCase();
            return categoryMatch && (!query || haystack.indexOf(query) !== -1);
        });
    }

    function createResourceCard(resource) {
        var importanceLabels = {
            3: "必看",
            2: "重点",
            1: "参考"
        };
        var tags = resource.tags.map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");

        var copyButton = resource.feed
            ? '<button class="copy-feed" type="button" data-feed="' + escapeHtml(resource.feed) +
                '" aria-label="复制 ' + escapeHtml(resource.name) + ' 的 RSS 地址">' +
                '<i class="fa fa-rss" aria-hidden="true"></i>复制 RSS</button>'
            : "";

        return '<article class="resource-card importance-' + resource.importance +
            (resource.featured ? " is-featured" : "") + '">' +
            '<div class="card-top">' +
                '<span class="resource-kind">' + escapeHtml(resource.kind) + "</span>" +
                '<div class="card-badges">' +
                    '<span class="importance-badge">' + importanceLabels[resource.importance] + "</span>" +
                    (resource.feed
                        ? '<span class="feed-badge"><i class="fa fa-rss" aria-hidden="true"></i> FEED</span>'
                        : "") +
                "</div>" +
            "</div>" +
            "<h4>" + escapeHtml(resource.name) + "</h4>" +
            "<p>" + escapeHtml(resource.description) + "</p>" +
            '<div class="card-tags">' + tags + "</div>" +
            '<div class="card-actions">' +
                '<a class="visit-link" href="' + escapeHtml(resource.url) +
                    '" target="_blank" rel="noopener noreferrer">访问网站' +
                    '<i class="fa fa-external-link" aria-hidden="true"></i></a>' +
                copyButton +
            "</div>" +
        "</article>";
    }

    function renderSections() {
        var filtered = getFilteredResources();
        var visibleCategories = categories.filter(function (category) {
            return filtered.some(function (resource) {
                return resource.category === category.id;
            });
        });

        resultCount.textContent = "显示 " + filtered.length + " / " + resources.length + " 个资源";
        clearSearch.hidden = state.category === "all" && !state.query;
        emptyState.hidden = filtered.length !== 0;
        sectionsElement.hidden = filtered.length === 0;

        sectionsElement.innerHTML = visibleCategories.map(function (category) {
            var categoryResources = filtered.filter(function (resource) {
                return resource.category === category.id;
            }).sort(function (left, right) {
                return right.importance - left.importance ||
                    left.originalOrder - right.originalOrder;
            });
            var categoryIndex = String(categories.indexOf(category) + 1).padStart(2, "0");
            return '<section class="resource-section" data-section="' + escapeHtml(category.id) + '">' +
                '<div class="resource-section-heading">' +
                    '<span class="section-index">' + categoryIndex + "</span>" +
                    "<div><h3>" + escapeHtml(category.label) + "</h3>" +
                    "<p>" + escapeHtml(category.description) + "</p></div>" +
                    '<span class="section-count">' + categoryResources.length + " SOURCES</span>" +
                "</div>" +
                '<div class="resource-grid">' +
                    categoryResources.map(createResourceCard).join("") +
                "</div>" +
            "</section>";
        }).join("");
    }

    function render() {
        renderFilters();
        renderSections();
    }

    function resetFilters() {
        state.category = "all";
        state.query = "";
        searchInput.value = "";
        render();
    }

    function showToast(message) {
        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add("is-visible");
        toastTimer = window.setTimeout(function () {
            toast.classList.remove("is-visible");
        }, 2200);
    }

    function fallbackCopy(value) {
        var input = document.createElement("textarea");
        input.value = value;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
    }

    function copyFeed(value) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(value).then(function () {
                showToast("RSS 地址已复制");
            }).catch(function () {
                fallbackCopy(value);
                showToast("RSS 地址已复制");
            });
            return;
        }
        fallbackCopy(value);
        showToast("RSS 地址已复制");
    }

    filtersElement.addEventListener("click", function (event) {
        var button = event.target.closest("[data-category]");
        if (!button) {
            return;
        }
        state.category = button.dataset.category;
        render();
    });

    sectionsElement.addEventListener("click", function (event) {
        var button = event.target.closest("[data-feed]");
        if (button) {
            copyFeed(button.dataset.feed);
        }
    });

    searchInput.addEventListener("input", function (event) {
        state.query = event.target.value;
        renderSections();
    });

    clearSearch.addEventListener("click", resetFilters);
    emptyReset.addEventListener("click", resetFilters);

    themeToggle.addEventListener("click", function () {
        var nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", nextTheme);
        applyTheme(nextTheme);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "/" && document.activeElement !== searchInput) {
            event.preventDefault();
            searchInput.focus();
        }
        if (event.key === "Escape" && document.activeElement === searchInput) {
            searchInput.blur();
        }
    });

    window.addEventListener("scroll", function () {
        backToTop.classList.toggle("is-visible", window.scrollY > 700);
    }, { passive: true });

    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("resource-total").textContent = resources.length;
    document.getElementById("feed-total").textContent = new Set(resources.filter(function (resource) {
        return Boolean(resource.feed);
    }).map(function (resource) {
        return resource.feed;
    })).size;
    document.getElementById("category-total").textContent = categories.length;

    initializeTheme();
    render();
})();
