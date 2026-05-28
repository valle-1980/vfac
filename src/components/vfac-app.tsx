"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import type {
  Audit,
  CreditMatrixItem,
  CreditWallet,
  InventoryItem,
  Provider,
  Quote,
  Residence,
  Role,
  Room,
  ServiceRequest,
  User
} from "@/lib/types";

type PocData = {
  users: User[];
  residences: Residence[];
  rooms: Room[];
  inventory: InventoryItem[];
  requests: ServiceRequest[];
  providers: Provider[];
  quotes: Quote[];
  wallets: CreditWallet[];
  creditMatrix: CreditMatrixItem[];
  audits: Audit[];
};

type Props = {
  data: PocData;
};

type LoginForm = {
  email: string;
  password: string;
};

type PropertyLayer = {
  id: string;
  label: string;
  kind: string;
  rooms: Array<{
    id: string;
    label: string;
    className: string;
    health: "ok" | "soon" | "overdue" | "requested";
    status?: string;
  }>;
};

type CriticalItem = {
  id: string;
  title: string;
  location: string;
  urgency: string;
  layerId: string;
  roomId: string;
};

const maintenanceOptions = {
  objects: [
    "Parede",
    "Piso",
    "Teto",
    "Lampada",
    "Tomada",
    "Torneira",
    "Ar-condicionado",
    "Bomba",
    "Filtro",
    "Porta",
    "Janela",
    "Revestimento"
  ],
  materials: [
    "Alvenaria",
    "Drywall",
    "Porcelanato",
    "Madeira",
    "Vidro",
    "Metal",
    "PVC",
    "Ceramica",
    "Marmore",
    "Granito"
  ],
  types: [
    "Manutencao preventiva",
    "Manutencao corretiva",
    "Troca",
    "Inspecao",
    "Limpeza tecnica",
    "Reparo simples",
    "Reparo especializado"
  ],
  brands: [
    "Nao informado",
    "Deca",
    "Docol",
    "Tigre",
    "Philips",
    "Osram",
    "LG",
    "Samsung",
    "Carrier",
    "Sodramar",
    "Outra"
  ],
  conditions: ["Novo", "Bom", "Em observacao", "Critico", "Sem informacao"],
  periodicities: [
    "Sob demanda",
    "Mensal",
    "Trimestral",
    "Semestral",
    "Anual",
    "A cada 24 meses"
  ]
};

const propertyLayers: PropertyLayer[] = [
  {
    id: "ground",
    label: "Terreo",
    kind: "Pavimento",
    rooms: [
      { id: "living", label: "Sala", className: "living", health: "requested", status: "2" },
      { id: "kitchen", label: "Cozinha", className: "kitchen", health: "overdue", status: "1" },
      { id: "office", label: "Escritorio", className: "office", health: "ok" },
      { id: "bath", label: "Lavabo", className: "bath", health: "soon" },
      { id: "garage", label: "Garagem", className: "garage", health: "ok" },
      { id: "hall", label: "Hall", className: "hall", health: "ok" }
    ]
  },
  {
    id: "upper",
    label: "Superior",
    kind: "Pavimento",
    rooms: [
      { id: "suite", label: "Suite casal", className: "suite", health: "soon", status: "1" },
      { id: "closet", label: "Closet", className: "closet", health: "ok" },
      { id: "bedroom", label: "Quarto", className: "bedroom", health: "ok" },
      { id: "bath-upper", label: "Banho", className: "bathUpper", health: "soon" },
      { id: "family", label: "Sala intima", className: "family", health: "ok" }
    ]
  },
  {
    id: "outside",
    label: "Quintal",
    kind: "Externo",
    rooms: [
      { id: "garden", label: "Jardim", className: "garden", health: "ok" },
      { id: "deck", label: "Deck", className: "deck", health: "overdue", status: "1" },
      { id: "service", label: "Area servico", className: "service", health: "ok" },
      { id: "perimeter", label: "Muro", className: "perimeter", health: "soon" }
    ]
  },
  {
    id: "pool",
    label: "Piscina",
    kind: "Externo",
    rooms: [
      { id: "pool-water", label: "Piscina", className: "poolWater", health: "ok" },
      { id: "pump", label: "Casa bombas", className: "pump", health: "requested", status: "1" },
      { id: "shower", label: "Ducha", className: "shower", health: "ok" },
      { id: "lounge", label: "Solario", className: "lounge", health: "ok" }
    ]
  },
  {
    id: "party",
    label: "Salao",
    kind: "Comum",
    rooms: [
      { id: "party-room", label: "Salao festas", className: "partyRoom", health: "ok" },
      { id: "gourmet", label: "Gourmet", className: "gourmet", health: "requested", status: "1" },
      { id: "restroom", label: "Banheiros", className: "restroom", health: "soon" },
      { id: "storage", label: "Deposito", className: "storage", health: "ok" }
    ]
  }
];

const criticalItems: CriticalItem[] = [
  {
    id: "crit_001",
    title: "Umidade na parede",
    location: "Cozinha",
    urgency: "Alta",
    layerId: "ground",
    roomId: "kitchen"
  },
  {
    id: "crit_002",
    title: "Bomba com ciclo vencendo",
    location: "Casa bombas",
    urgency: "Alta",
    layerId: "pool",
    roomId: "pump"
  },
  {
    id: "crit_003",
    title: "Deck com desgaste",
    location: "Deck",
    urgency: "Media",
    layerId: "outside",
    roomId: "deck"
  },
  {
    id: "crit_004",
    title: "Ar-condicionado",
    location: "Suite casal",
    urgency: "Media",
    layerId: "upper",
    roomId: "suite"
  },
  {
    id: "crit_005",
    title: "Iluminacao gourmet",
    location: "Gourmet",
    urgency: "Media",
    layerId: "party",
    roomId: "gourmet"
  },
  {
    id: "crit_006",
    title: "Lampada queimada",
    location: "Sala",
    urgency: "Baixa",
    layerId: "ground",
    roomId: "living"
  },
  {
    id: "crit_007",
    title: "Revisao de muro",
    location: "Muro",
    urgency: "Baixa",
    layerId: "outside",
    roomId: "perimeter"
  }
];

const roleTitles: Record<Role, string> = {
  client: "Painel do cliente",
  employee: "Operacao da residencia",
  admin: "Central administrativa",
  provider: "Portal do prestador",
  it: "Console TI / Master"
};

const roleCopy: Record<Role, string> = {
  client:
    "Acompanhe a residencia, aprove orcamentos, veja creditos e mantenha o historico operacional da casa.",
  employee:
    "Registre problemas, envie fotos e ajude a residencia a ser mapeada pelo uso do dia a dia.",
  admin:
    "Controle disputas de orcamento, prestadores, intercorrencias, auditorias e regras de creditos.",
  provider:
    "Receba oportunidades sem acesso direto ao cliente antes da aprovacao e registre a execucao com fotos.",
  it:
    "Simule qualquer perfil, valide permissoes e acompanhe logs sensiveis da POC."
};

function statusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("aprov")) return "status approved";
  if (normalized.includes("disputa")) return "status dispute";
  if (normalized.includes("intercorr")) return "status alert";
  return "status pending";
}

function getProvider(providerId: string, providers: Provider[]) {
  return providers.find((provider) => provider.id === providerId);
}

function LoginScreen({
  users,
  onLogin
}: {
  users: User[];
  onLogin: (user: User) => void;
}) {
  const [form, setForm] = useState<LoginForm>({
    email: "cliente@vfac.local",
    password: "123456"
  });
  const [error, setError] = useState("");

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = users.find(
      (currentUser) =>
        currentUser.email.toLowerCase() === form.email.trim().toLowerCase() &&
        currentUser.password === form.password
    );

    if (!user) {
      setError("Usuario ou senha invalidos para esta POC.");
      return;
    }

    setError("");
    onLogin(user);
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="brand-mark">vF</div>
        <p className="eyebrow">Facilities residencial</p>
        <h1>vFac</h1>
        <p>Cuidado da casa antes da urgencia virar problema.</p>
      </section>

      <section className="login-panel card">
        <div className="section-title">
          <div>
            <h2>Entrar</h2>
            <p>Escolha um acesso fake para explorar a POC.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={submitLogin}>
          <label>
            E-mail
            <input
              autoComplete="username"
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              type="email"
              value={form.email}
            />
          </label>

          <label>
            Senha
            <input
              autoComplete="current-password"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value
                }))
              }
              type="password"
              value={form.password}
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="button dark" type="submit">
            Acessar POC
          </button>
        </form>

        <div className="demo-access">
          <span>Usuarios fake</span>
          {users.map((user) => (
            <button
              className="demo-user"
              key={user.id}
              onClick={() => onLogin(user)}
              type="button"
            >
              <strong>{user.label}</strong>
              <small>
                {user.email} | senha {user.password}
              </small>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function VisibilityNotice({ request }: { request: ServiceRequest }) {
  if (request.providerVisibleToClient) {
    return (
      <div className="notice">
        Prestador liberado apos aprovacao: o cliente recebe primeiro nome,
        documento mascarado e janela de chegada para autorizar a entrada.
      </div>
    );
  }

  return (
    <div className="notice">
      Prestador oculto nesta etapa: o cliente compara prazo, creditos e
      condicoes sem contato direto ate aprovar o orcamento.
    </div>
  );
}

function CreditPanel({ wallet }: { wallet: CreditWallet }) {
  const usedPercentage = Math.round(
    (wallet.usedCredits / wallet.monthlyCredits) * 100
  );

  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h3>Carteira de creditos</h3>
          <p>Ciclo {wallet.cycle}. Creditos nao usados expiram no fechamento.</p>
        </div>
        <span className="badge gold">Expira {wallet.expiresAt}</span>
      </div>

      <div className="split">
        <div className="credit-stat">
          <span>Saldo disponivel</span>
          <strong>{wallet.availableCredits}</strong>
          <span>de {wallet.monthlyCredits} creditos mensais</span>
        </div>
        <div className="credit-stat">
          <span>Consumido no ciclo</span>
          <strong>{wallet.usedCredits}</strong>
          <div
            className="credit-bar"
            style={{ "--used": `${usedPercentage}%` } as CSSProperties}
          >
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsHero({
  requests,
  wallet,
  residence
}: {
  requests: ServiceRequest[];
  wallet: CreditWallet;
  residence: Residence;
}) {
  const usedPercentage = Math.round(
    (wallet.usedCredits / wallet.monthlyCredits) * 100
  );
  const [activeLayerId, setActiveLayerId] = useState(propertyLayers[0].id);
  const [activeRoomId, setActiveRoomId] = useState<string | null>("kitchen");
  const [mappingDraft, setMappingDraft] = useState({
    object: maintenanceOptions.objects[0],
    material: maintenanceOptions.materials[0],
    type: maintenanceOptions.types[0],
    brand: maintenanceOptions.brands[0],
    condition: maintenanceOptions.conditions[2],
    periodicity: maintenanceOptions.periodicities[0]
  });
  const activeLayer =
    propertyLayers.find((layer) => layer.id === activeLayerId) ??
    propertyLayers[0];
  const activeRoom = activeLayer.rooms.find((room) => room.id === activeRoomId);

  function selectCriticalItem(item: CriticalItem) {
    setActiveLayerId(item.layerId);
    setActiveRoomId(item.roomId);
  }

  return (
    <section className="analytics-grid">
      <div className="chart-card card">
        <div className="chart-head">
          <div>
            <h3>Gestao operacional da residencia</h3>
            <p>
              {residence.name} | {activeLayer.kind}: {activeLayer.label}
            </p>
          </div>
          <button className="ghost-button" type="button">
            Editar mapa
          </button>
        </div>

        <div className="map-status-strip">
          <div className="mapped">
            <small>IM</small>
            <span>Itens mapeados</span>
            <strong>{residence.inventoryCount}</strong>
            <em>Inventario ativo</em>
          </div>
          <div className="open">
            <small>DA</small>
            <span>Demandas abertas</span>
            <strong>{requests.length}</strong>
            <em>Preventivas e reativas</em>
          </div>
          <div className="dispute">
            <small>ED</small>
            <span>Em disputa</span>
            <strong>
              {
                requests.filter((request) =>
                  request.status.toLowerCase().includes("disputa")
                ).length
              }
            </strong>
            <em>Orcamento ativo</em>
          </div>
          <div className="incident">
            <small>IN</small>
            <span>Intercorrencias</span>
            <strong>
              {
                requests.filter((request) =>
                  request.status.toLowerCase().includes("intercorr")
                ).length
              }
            </strong>
            <em>Requer atencao</em>
          </div>
        </div>

        <div className="property-map-shell">
          <div className="layer-palette" aria-label="Selecionar pavimento ou ambiente">
            {propertyLayers.map((layer) => (
              <button
                className={layer.id === activeLayer.id ? "active" : ""}
                key={layer.id}
                onClick={() => {
                  setActiveLayerId(layer.id);
                  setActiveRoomId(null);
                }}
                type="button"
              >
                <strong>{layer.label}</strong>
                <span>{layer.kind}</span>
              </button>
            ))}
          </div>

          <div className={`property-map ${activeLayer.id}`} aria-label={`Mapa 2D ${activeLayer.label}`}>
            {activeLayer.rooms.map((room) => (
              <button
                className={`map-area ${room.className} ${room.health} ${
                  room.id === activeRoomId ? "selected" : ""
                }`}
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                type="button"
              >
                <span>{room.label}</span>
                {room.status ? <i>{room.status}</i> : null}
              </button>
            ))}
          </div>
        </div>

        {activeRoom ? (
          <div className="mapping-panel">
            <div>
              <span>Mapeamento do ponto</span>
              <strong>{activeRoom.label}</strong>
            </div>
            <label>
              Objeto
              <select
                onChange={(event) =>
                  setMappingDraft((current) => ({
                    ...current,
                    object: event.target.value
                  }))
                }
                value={mappingDraft.object}
              >
                {maintenanceOptions.objects.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Material
              <select
                onChange={(event) =>
                  setMappingDraft((current) => ({
                    ...current,
                    material: event.target.value
                  }))
                }
                value={mappingDraft.material}
              >
                {maintenanceOptions.materials.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Tipo
              <select
                onChange={(event) =>
                  setMappingDraft((current) => ({
                    ...current,
                    type: event.target.value
                  }))
                }
                value={mappingDraft.type}
              >
                {maintenanceOptions.types.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Marca
              <select
                onChange={(event) =>
                  setMappingDraft((current) => ({
                    ...current,
                    brand: event.target.value
                  }))
                }
                value={mappingDraft.brand}
              >
                {maintenanceOptions.brands.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Estado
              <select
                onChange={(event) =>
                  setMappingDraft((current) => ({
                    ...current,
                    condition: event.target.value
                  }))
                }
                value={mappingDraft.condition}
              >
                {maintenanceOptions.conditions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Periodicidade
              <select
                onChange={(event) =>
                  setMappingDraft((current) => ({
                    ...current,
                    periodicity: event.target.value
                  }))
                }
                value={mappingDraft.periodicity}
              >
                {maintenanceOptions.periodicities.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <button className="button dark" type="button">
              Salvar no inventario
            </button>
          </div>
        ) : null}

        <div className="chart-legend">
          <span><i /> Ponto com demanda</span>
          <strong>{requests.length}</strong>
          <span><i className="teal" /> Area mapeada</span>
          <strong>{activeLayer.rooms.length}</strong>
        </div>
      </div>

      <aside className="insights-column">
        <div className="card donut-card">
          <div className="section-title">
            <div>
              <h3>Consumo de creditos</h3>
              <p>Ciclo atual</p>
            </div>
          </div>
          <div
            className="donut"
            style={{ "--used": `${usedPercentage * 3.6}deg` } as CSSProperties}
          >
            <strong>{wallet.monthlyCredits}+</strong>
            <span>Plano</span>
          </div>
          <div className="donut-stats">
            <span>Usados <strong>{wallet.usedCredits}</strong></span>
            <span>Saldo <strong>{wallet.availableCredits}</strong></span>
            <span>Expira <strong>31/05</strong></span>
          </div>
        </div>

        <div className="card mini-chart">
          <div className="section-title">
            <div>
              <h3>Progresso da casa</h3>
              <p>7 itens mais criticos</p>
            </div>
          </div>
          <div className="critical-list">
            {criticalItems.map((item, index) => (
              <button
                className={item.roomId === activeRoomId ? "active" : ""}
                key={item.id}
                onClick={() => selectCriticalItem(item)}
                type="button"
              >
                <strong>{index + 1}</strong>
                <span>
                  {item.title}
                  <small>{item.location}</small>
                </span>
                <em className={item.urgency.toLowerCase()}>{item.urgency}</em>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

function RequestsTable({
  requests,
  role
}: {
  requests: ServiceRequest[];
  role: Role;
}) {
  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h3>Demandas ativas</h3>
          <p>Sistema e usuarios alimentam o inventario enquanto resolvem problemas.</p>
        </div>
        <button className="button secondary" type="button">
          Nova demanda
        </button>
      </div>

      <div className="table">
        {requests.map((request) => (
          <div className="row" key={request.id}>
            <div>
              <strong>{request.title}</strong>
              <small>
                {request.room} | Origem: {request.origin} | Prioridade:{" "}
                {request.priority}
              </small>
            </div>
            <span className={statusClass(request.status)}>{request.status}</span>
            <strong>{request.estimatedCredits} creditos</strong>
            <button className="button" type="button">
              {role === "provider" ? "Orcar" : "Detalhes"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuotesPanel({
  selectedRequest,
  quotes,
  providers,
  role
}: {
  selectedRequest: ServiceRequest;
  quotes: Quote[];
  providers: Provider[];
  role: Role;
}) {
  const requestQuotes = quotes.filter(
    (quote) => quote.serviceRequestId === selectedRequest.id
  );

  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h3>Disputa de orcamento</h3>
          <p>{selectedRequest.title}</p>
        </div>
        <span className={statusClass(selectedRequest.status)}>
          {selectedRequest.status}
        </span>
      </div>

      <VisibilityNotice request={selectedRequest} />

      <div className="quote-list" style={{ marginTop: 12 }}>
        {requestQuotes.map((quote) => {
          const provider = getProvider(quote.providerId, providers);
          const showProvider =
            selectedRequest.providerVisibleToClient ||
            role === "admin" ||
            role === "provider" ||
            role === "it";

          return (
            <article className="quote" key={quote.id}>
              <header>
                <div>
                  <strong>
                    {showProvider
                      ? provider?.firstName ?? "Prestador"
                      : "Prestador credenciado"}
                  </strong>
                  <small>
                    {showProvider
                      ? `${provider?.company} | ${provider?.document}`
                      : "Identidade liberada somente apos aprovacao"}
                  </small>
                </div>
                <span className={statusClass(quote.status)}>{quote.status}</span>
              </header>

              <dl>
                <div>
                  <dt>Mao de obra</dt>
                  <dd>{quote.laborCredits}</dd>
                </div>
                <div>
                  <dt>Material</dt>
                  <dd>{quote.materialCredits}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{quote.totalCredits}</dd>
                </div>
              </dl>

              <div className="row compact">
                <span>
                  {quote.withMaterial
                    ? "Material fornecido pela operacao"
                    : "Material do cliente"}
                  <small>{quote.eta}</small>
                </span>
                <button className="button dark" type="button">
                  Aprovar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function InventoryPanel({
  rooms,
  inventory
}: {
  rooms: Room[];
  inventory: InventoryItem[];
}) {
  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h3>Inventario vivo</h3>
          <p>Mapeamento inicial por fotos e itens, com evolucao futura para 2D/3D.</p>
        </div>
        <span className="badge blue">{inventory.length} itens amostrados</span>
      </div>

      <div className="inventory">
        {inventory.map((item) => {
          const room = rooms.find((currentRoom) => currentRoom.id === item.roomId);

          return (
            <div className="inventory-item" key={item.id}>
              <strong>{item.name}</strong>
              <span>
                {room?.name} | {item.category}
              </span>
              <small>{item.status}</small>
              <small>Proximo: {item.nextService}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CreditMatrixPanel({ matrix }: { matrix: CreditMatrixItem[] }) {
  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h3>Matriz de creditos</h3>
          <p>Base inicial para comparar material proprio e material fornecido.</p>
        </div>
      </div>

      <div className="table">
        {matrix.map((item) => (
          <div className="row" key={item.id}>
            <div>
              <strong>{item.service}</strong>
              <small>
                {item.category} | {item.complexity}
              </small>
            </div>
            <span className="status dispute">
              {item.firstVisitEligible ? "1a visita" : "Vistoria"}
            </span>
            <strong>{item.totalWithMaterial} com material</strong>
            <strong>{item.totalWithoutMaterial} sem material</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPanel({
  providers,
  audits
}: {
  providers: Provider[];
  audits: Audit[];
}) {
  return (
    <div className="grid two">
      <div className="card">
        <div className="section-title">
          <div>
            <h3>Prestadores</h3>
            <p>Controle operacional de rede, equipe propria e credenciados.</p>
          </div>
        </div>
        <div className="table">
          {providers.map((provider) => (
            <div className="row compact" key={provider.id}>
              <span>
                <strong>{provider.firstName}</strong>
                <small>
                  {provider.company} | {provider.categories.join(", ")}
                </small>
              </span>
              <span className="badge">{provider.rating.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">
          <div>
            <h3>Auditorias</h3>
            <p>Acionadas em discordancia, premium ou risco operacional.</p>
          </div>
        </div>
        <div className="timeline">
          {audits.map((audit) => (
            <div className="event" key={audit.id}>
              <strong>{audit.type}</strong>
              <span>{audit.reason}</span>
              <span>
                {audit.status} | {audit.scheduledFor}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoleSpecificPanels({
  role,
  data,
  selectedRequest
}: {
  role: Role;
  data: PocData;
  selectedRequest: ServiceRequest;
}) {
  if (role === "admin") {
    return (
      <>
        <AdminPanel providers={data.providers} audits={data.audits} />
        <CreditMatrixPanel matrix={data.creditMatrix} />
      </>
    );
  }

  if (role === "provider") {
    return (
      <div className="grid two">
        <RequestsTable requests={data.requests} role={role} />
        <div className="card">
          <div className="section-title">
            <div>
              <h3>Registro de execucao</h3>
              <p>Fotos e consumo real alimentam a qualidade e o historico.</p>
            </div>
          </div>
          <div className="photos">
            <div className="photo">Antes</div>
            <div className="photo">Durante</div>
            <div className="photo">Depois</div>
          </div>
        </div>
      </div>
    );
  }

  if (role === "employee") {
    return (
      <div className="grid two">
        <div className="card">
          <div className="section-title">
            <div>
              <h3>Registro rapido</h3>
              <p>Fluxo reativo para mapear a casa conforme surgem problemas.</p>
            </div>
          </div>
          <div className="table">
            <div className="row compact">
              <span>
                <strong>Foto do problema</strong>
                <small>Enviar imagem, comodo, objeto e observacao.</small>
              </span>
              <button className="button" type="button">
                Registrar
              </button>
            </div>
            <div className="row compact">
              <span>
                <strong>Acompanhar visita</strong>
                <small>Confirmar chegada, execucao e fotos finais.</small>
              </span>
              <button className="button secondary" type="button">
                Agenda
              </button>
            </div>
          </div>
        </div>
        <RequestsTable requests={data.requests} role={role} />
      </div>
    );
  }

  if (role === "it") {
    return (
      <>
        <div className="card">
          <div className="section-title">
            <div>
              <h3>Simulador master</h3>
              <p>Troque o perfil na barra lateral para validar permissoes e mascaramento.</p>
            </div>
            <span className="badge blue">Log obrigatorio</span>
          </div>
          <div className="timeline">
            <div className="event">
              <strong>Simulacao de perfil</strong>
              <span>TI visualizou regras de cliente e prestador em ambiente POC.</span>
            </div>
            <div className="event">
              <strong>Auditoria de dados sensiveis</strong>
              <span>Documento do prestador so aparece apos aprovacao ou para perfis internos.</span>
            </div>
          </div>
        </div>
        <QuotesPanel
          selectedRequest={selectedRequest}
          quotes={data.quotes}
          providers={data.providers}
          role={role}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid two">
        <RequestsTable requests={data.requests} role={role} />
        <QuotesPanel
          selectedRequest={selectedRequest}
          quotes={data.quotes}
          providers={data.providers}
          role={role}
        />
      </div>
      <InventoryPanel rooms={data.rooms} inventory={data.inventory} />
    </>
  );
}

export function VfacApp({ data }: Props) {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("client");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const selectedUser =
    data.users.find((user) => user.role === selectedRole) ?? data.users[0];
  const residence = data.residences[0];
  const wallet = data.wallets[0];
  const selectedRequest = useMemo(
    () =>
      data.requests.find((request) => request.id === "srv_002") ??
      data.requests[0],
    [data.requests]
  );

  function handleLogin(user: User) {
    setLoggedUser(user);
    setSelectedRole(user.role);
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    setLoggedUser(null);
    setSelectedRole("client");
    setMobileMenuOpen(false);
  }

  if (!loggedUser) {
    return <LoginScreen users={data.users} onLogin={handleLogin} />;
  }

  const canSimulateRoles = loggedUser.role === "it";

  return (
    <div className="shell">
      <aside
        className={`sidebar ${canSimulateRoles ? "master-sidebar" : ""} ${
          mobileMenuOpen ? "mobile-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-mark">vF</div>
          <div>
            <h1>vFac POC</h1>
            <p>Inventario vivo da residencia.</p>
          </div>
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            {mobileMenuOpen ? "Fechar" : "Menu"}
          </button>
        </div>

        <div className="mobile-menu-content">
          <nav className="side-nav" aria-label="Navegacao principal">
            <button className="active" type="button">
              <span>Db</span> Dashboard
            </button>
            <button type="button">
              <span>In</span> Inventario
            </button>
            <button type="button">
              <span>Dm</span> Demandas
            </button>
            <button type="button">
              <span>$</span> Creditos
            </button>
          </nav>

          <div>
            <small>{canSimulateRoles ? "Simular perfil" : "Acesso atual"}</small>
            <div className="role-list" style={{ marginTop: 10 }}>
              {(canSimulateRoles ? data.users : [loggedUser]).map((user) => (
                <button
                  className={`role-button ${user.role === selectedRole ? "active" : ""}`}
                  disabled={!canSimulateRoles}
                  key={user.id}
                  onClick={() => {
                    setSelectedRole(user.role);
                    setMobileMenuOpen(false);
                  }}
                  type="button"
                >
                  <strong>{user.label}</strong>
                  <small>{user.name}</small>
                </button>
              ))}
            </div>
          </div>

          <div
            className="session-box"
            data-initials={loggedUser.name
              .split(" ")
              .map((namePart) => namePart[0])
              .join("")
              .slice(0, 2)}
          >
            <small>Logado como</small>
            <strong>{loggedUser.name}</strong>
            <span>{loggedUser.email}</span>
            <button className="button secondary" onClick={handleLogout} type="button">
              Sair
            </button>
          </div>

          <small>
            Dados simulados em JSON, prontos para evoluir para PostgreSQL/Prisma.
          </small>
        </div>
      </aside>

      <main className="main">
        <section className="page-head">
          <div>
            <p className="eyebrow">{selectedUser.label}</p>
            <h2>{roleTitles[selectedRole]}</h2>
            <p>{roleCopy[selectedRole]}</p>
          </div>
          <div className="top-actions">
            <div className="badge-row">
              <span className="badge">{residence.type}</span>
              <span className="badge gold">{residence.standard}</span>
              <span className="badge blue">{residence.mappingMode}</span>
            </div>
            <button className="button dark" type="button">
              Nova demanda
            </button>
          </div>
        </section>

        <AnalyticsHero requests={data.requests} wallet={wallet} residence={residence} />

        <RoleSpecificPanels
          role={selectedRole}
          data={data}
          selectedRequest={selectedRequest}
        />
      </main>
    </div>
  );
}
