require "rails_helper"

RSpec.describe "Application", type: :request do
  describe "GET /" do
    it "returns application info" do
      get "/"

      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response["message"]).to eq("Welcome to <%= appName %> API")
      expect(json_response["version"]).to be_present
      expect(json_response["environment"]).to eq("development")
    end
  end

  describe "GET /health" do
    it "returns health status" do
      get "/health"

      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response["status"]).to eq("healthy")
      expect(json_response["timestamp"]).to be_present
    end
  end

  describe "CORS" do
    it "allows cross-origin requests" do
      get "/", headers: { "Origin" => "http://localhost:5173" }

      expect(response.headers["Access-Control-Allow-Origin"]).to eq("http://localhost:5173")
      expect(response.headers["Access-Control-Allow-Methods"]).to include("GET", "POST", "PUT", "DELETE")
    end
  end
end
