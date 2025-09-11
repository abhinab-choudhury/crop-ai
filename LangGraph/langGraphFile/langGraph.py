from langgraph.graph import StateGraph,START,END
import os
from langchain.chat_models import init_chat_model
import google.generativeai as genai

#use ur Gemini api key
genai.configure(api_key="")

class GraphState(TypedDict, total=False):
     input: str
     route: Optional[str]
     llm_output: Optional[str]
     ml_output: Optional[str]

def router_node(state: GraphState):
    query = state.get("input", "")
    print("Router query:", query)

    prompt = f"""
    You are a router. The user may ask about:
    - Crop rotation, soil, farming techniques → return 'LLM_Node'
    - Plant disease, pest, or treatment (often with an image) → return 'ML_Node'
    Respond ONLY with 'LLM_Node' or 'ML_Node'.
    Query: {query}
    """

    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
    decision = response.candidates[0].content.parts[0].text.strip().replace(" ", "")
    
    if decision not in ["LLM_Node", "ML_Node"]:
        decision = "LLM_Node"

    state["route"] = decision
    return state

# use LLM_Model ovr here and return it as a state
def llm_node(state: GraphState):
    state["llm_output"] = "It will predict which crop to plant in which month for great revenue."
    return state
# use ML_Model ovr here and return it as a state
def ml_node(state: GraphState):
    state["ml_output"] = "It will give me the result of which disease my plant has."
    return state

graph = StateGraph(GraphState)

graph.add_node("Router_Node", router_node)
graph.add_node("LLM_Node", llm_node)
graph.add_node("ML_Node", ml_node)

graph.add_edge(START, "Router_Node")

graph.add_conditional_edges(
    "Router_Node",
    lambda state: state["route"],
    {
        "LLM_Node": "LLM_Node",
        "ML_Node": "ML_Node"
    }
)

graph.add_edge("LLM_Node", END)
graph.add_edge("ML_Node", END)

# helps us to compile the graph
app = graph.compile()

result = app.invoke({"input": "What crop rotation would yeild better revenue?"})
print(result)
