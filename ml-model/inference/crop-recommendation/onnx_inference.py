import pickle

# Loading crop recommendation model
crop_recommendation_model_path = '/../../models/crop-recommendation/RandomForest.pkl'
crop_recommendation_model = pickle.load(
    open(crop_recommendation_model_path, 'rb'))