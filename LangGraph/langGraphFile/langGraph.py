from langgraph.graph import StateGraph,START,END
import os
from langchain.chat_models import init_chat_model
import google.generativeai as genai

genai.configure(api_key="")

class GraphState(dict):
    pass

def router_node(state: GraphState):
    query = state.get("input", "")

    prompt = f"""
    You are a router. The user may ask about:
    - Crop rotation, soil, farming techniques → return 'LLM_Model'
    - Plant disease, pest, or treatment (often with an image) → return 'ML_Model'
    Respond ONLY with 'LLM_Model' or 'ML_Model'.
    Query: {query}
    """

    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
    print(response)
    decision = response.candidates[0].content.parts[0].text.strip().replace(" ", "")
    state["route"] = decision
    return state

def llm_node(state:GraphState):
    state["llm_output"]="it will predict the which crop to plant in which moth for great revenue"
    return state

def ml_node(state:GraphState): 
    state["ml_output"]="it will give me the result of my plant has which dieases"
    return state

graph=StateGraph(GraphState)

graph.add_node("Router_Node",router_node)
graph.add_node("LLM_Node",llm_node)
graph.add_node("ML_Node",ml_node)


graph.add_edge(START, "Router_Node")
graph.add_conditional_edges(
    "Router_Node",
    lambda state: state["route"],
    {
        "LLM_Model": "LLM_Node",
        "ML_Model": "ML_Node"
    }
)

graph.add_edge("LLM_Node", END)
graph.add_edge("ML_Node", END)


app = graph.compile()

# result = app.invoke({"input": "Explain crop rotation"}, return_state=True)
result = app.invoke({"input": "What disease does my plant have?"}, return_state=True)

print(result)
