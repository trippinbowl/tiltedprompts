# Backend Stack Decision — TiltedPrompts
## Supabase vs AWS vs Hybrid

---

## DECISION: Option C — Hybrid Stack

**Supabase + Cloudflare for MCP Platform | AWS Mumbai for Voice AI**

The two workloads have fundamentally different infrastructure needs. Forcing them into a single vendor means either overpaying (all-AWS) or being blocked on GPU availability (all-Supabase/Cloudflare).

---

## WHY HYBRID

### MCP Platform → Supabase + Cloudflare
| Need | Solution | Why |
|------|----------|-----|
| Database | Supabase PostgreSQL | Free tier (500MB, 50K MAU), instant setup, built-in RLS, real-time subscriptions |
| Auth | Supabase Auth | Free tier, social logins, JWT out of the box, no Cognito complexity |
| Edge Compute | Cloudflare Workers | Zero cold starts, 300+ locations, native `McpAgent` SDK, $5/mo for 10M requests |
| Storage | Supabase Storage | Free 1GB, S3-compatible, CDN built in |
| Analytics | Cloudflare Analytics Engine | Free with Workers, SQL-based, no ClickHouse needed at bootstrap |

### Voice AI → AWS Mumbai (ap-south-1)
| Need | Solution | Why |
|------|----------|-----|
| GPU Inference | EC2 g5.xlarge or g6.xlarge | Whisper + faster-whisper needs GPU, ~$0.50-1.00/hr spot |
| REST API | ECS Fargate or Lambda | FastAPI container for TiltedVani API |
| WebSocket | ALB + ECS | Real-time voice streaming needs persistent connections |
| Low India Latency | Mumbai region | <20ms to Indian users vs 150ms+ from US regions |
| Telephony | Exotel (India) | Needs low-latency connection to Indian telecom infra |

---

## COST ESTIMATES

### Bootstrap Phase (0-100 users, 10K requests/month)

| Component | Service | Monthly Cost |
|-----------|---------|-------------|
| Database | Supabase Free | $0 |
| Auth | Supabase Free | $0 |
| MCP Edge | Cloudflare Workers Free | $0 |
| Voice API | AWS t3.medium (on-demand) | ~$30 |
| Sarvam AI | Pay-per-use API | ~$10 |
| Domain/DNS | Cloudflare | $0 |
| **TOTAL** | | **~$40/month** |

### Growth Phase (1K users, 500K requests/month)

| Component | Service | Monthly Cost |
|-----------|---------|-------------|
| Database | Supabase Pro | $25 |
| MCP Edge | Cloudflare Workers Paid | $5 |
| Voice API | AWS g5.xlarge spot | ~$150 |
| Sarvam AI | Volume pricing | ~$50 |
| Monitoring | Supabase + CloudWatch | ~$20 |
| **TOTAL** | | **~$250/month** |

### Scale Phase (10K users, 5M requests/month)

| Component | Service | Monthly Cost |
|-----------|---------|-------------|
| Database | Supabase Team | $599 |
| MCP Edge | Cloudflare Workers Pro | $25 |
| Voice API | AWS ECS + g5 fleet | ~$800 |
| Sarvam AI | Enterprise pricing | ~$300 |
| CDN/Storage | Cloudflare R2 | ~$50 |
| Monitoring | Datadog or Grafana | ~$100 |
| **TOTAL** | | **~$1,875/month** |

---

## COMPARE: ALL-AWS COST

For reference, going all-AWS would cost:

| Phase | Hybrid Cost | All-AWS Cost | Savings |
|-------|------------|-------------|---------|
| Bootstrap | ~$40/mo | ~$150/mo | 73% cheaper |
| Growth | ~$250/mo | ~$600/mo | 58% cheaper |
| Scale | ~$1,875/mo | ~$3,500/mo | 46% cheaper |

All-AWS is significantly more expensive at every stage because:
- RDS PostgreSQL starts at ~$30/mo (vs Supabase free)
- Cognito has complex pricing and poor DX
- Lambda cold starts are 100-500ms (vs Cloudflare Workers <1ms)
- No free tier for ALB ($16/mo minimum)

---

## MIGRATION PATH

If Supabase ever becomes limiting:

1. **Database migration**: Supabase is standard PostgreSQL — `pg_dump` and restore to any PostgreSQL (RDS, Neon, self-hosted). Zero application code changes.

2. **Auth migration**: Supabase Auth uses standard JWT. Can swap to Auth0/Clerk with token format changes only.

3. **Edge migration**: Cloudflare Workers → AWS Lambda@Edge or CloudFront Functions. Hono framework works on both.

**Risk: LOW.** Everything is built on open standards (PostgreSQL, JWT, HTTP). No proprietary lock-in.

---

## DEVELOPER EXPERIENCE COMPARISON

| Aspect | Supabase + Cloudflare | AWS |
|--------|----------------------|-----|
| Time to first API | 5 minutes | 30-60 minutes |
| Auth setup | 1 click (dashboard) | Hours (Cognito config) |
| Database GUI | Built-in SQL editor | Need pgAdmin/DBeaver |
| Realtime | Built-in subscriptions | Needs AppSync or custom |
| Edge deploy | `wrangler deploy` | CloudFormation/CDK hell |
| Local dev | `supabase start` | LocalStack (unreliable) |
| Documentation | Excellent | Vast but scattered |

---

## FINAL ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│                 TiltedPrompts                     │
├──────────────────────┬──────────────────────────┤
│    MCP Platform      │      Voice Platform       │
│  (Supabase + CF)     │    (AWS Mumbai)           │
├──────────────────────┼──────────────────────────┤
│                      │                           │
│  Cloudflare Workers  │  ECS Fargate / EC2 GPU   │
│  (MCP server edge)   │  (TiltedVoice API)       │
│         ↕            │         ↕                 │
│  Supabase PostgreSQL │  RDS PostgreSQL           │
│  (user data, servers)│  (voice logs, sessions)   │
│         ↕            │         ↕                 │
│  Supabase Auth       │  Sarvam AI API           │
│  (login, JWT)        │  (Hindi STT/TTS)         │
│         ↕            │         ↕                 │
│  CF Analytics Engine │  CloudWatch + S3          │
│  (invocation logs)   │  (audio logs, metrics)    │
│                      │                           │
└──────────────────────┴──────────────────────────┘
            ↕                      ↕
    ┌──────────────┐     ┌─────────────────┐
    │   Dashboard   │     │  Exotel + GSP   │
    │  (Vercel)     │     │  (Telephony)    │
    └──────────────┘     └─────────────────┘
```

---

## IMMEDIATE SETUP STEPS

### Supabase:
1. Create org: tiltedprompts on supabase.com
2. Create project: tilted-main (free tier, region: ap-south-1 Singapore)
3. Enable Auth (email + Google social login)
4. Create initial tables: users, servers, api_keys, deployments
5. Set up RLS policies

### Cloudflare:
1. Account setup with Workers enabled
2. Configure DNS for mcp.tiltedprompts.com
3. Create first Worker (hello-world MCP server)
4. Set up Analytics Engine binding

### AWS Mumbai:
1. Create AWS account (or use existing)
2. Set up IAM roles for ECS
3. VPC in ap-south-1 (Mumbai)
4. ECR for Docker images
5. Reserve g5.xlarge spot capacity (for voice inference)

---

*Decision made: February 2026*
*Review at: 1K users milestone*
