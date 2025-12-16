import torch
import torch.nn as nn
import torch.nn.functional as F

class RedditPredictor(nn.Module):
    def __init__(self, word_vectors=[], vocab_length=100, vocab_size=0, input_size=1110, dropout=[0.25, 0.25, 0.25, 0.25]):
        super(RedditPredictor, self).__init__()

        if len(word_vectors) > 0:
            self.input_layer = nn.Embedding.from_pretrained(word_vectors)
        else:
            self.input_layer = nn.Embedding(vocab_length, vocab_size)

        self.cov_layer = nn.Conv2d(1, 10, (7, 100))
        torch.nn.init.xavier_uniform_(self.cov_layer.weight)
        
        self.layer1 = nn.Linear(input_size-6, 500)
        self.layer2 = nn.Linear(500, 200)
        self.layer3 = nn.Linear(200, 50)
        self.layer4 = nn.Linear(50, 5)
        self.dropout = dropout

    def forward(self, input_comment):
        output = self.input_layer(input_comment)
        output = self.cov_layer(output.unsqueeze(1))
        output = F.max_pool1d(output.squeeze(-1).transpose(2,1), 10)
        output = F.dropout(output, p=self.dropout[0])
        output = self.layer1(output.view(output.size(0), -1))
        output = F.relu(output)
        output = F.dropout(output, p=self.dropout[1])
        output = self.layer2(output)
        output = F.relu(output)
        output = F.dropout(output, p=self.dropout[2])
        output = self.layer3(output)
        output = F.relu(output)
        output = F.dropout(output, p=self.dropout[3])
        output = self.layer4(output)
        return output

    def predict(self, input_comment):
        output = self.forward(input_comment)
        return F.softmax(output, dim=1).detach()

class RedditTransformerPredictor(nn.Module):
    def __init__(
        self, 
        word_vectors=[], vocab_length=100, vocab_dim=100, 
        max_length=227, dropout=[0.25, 0.25, 0.25, 0.25, 0.25]
    ):
        super(RedditTransformerPredictor, self).__init__()

        if len(word_vectors) > 0:
            self.input_layer = nn.Embedding.from_pretrained(word_vectors)
        else:
            self.input_layer = nn.Embedding(vocab_length, vocab_dim)

        self.encoder_layer = nn.TransformerEncoderLayer(d_model=100, nhead=5, dim_feedforward=50)
        self.encoder = nn.TransformerEncoder(self.encoder_layer, num_layers=4)
        
        self.layer1 = nn.Linear(max_length*vocab_dim, 500)
        self.layer2 = nn.Linear(500, 300)
        self.layer3 = nn.Linear(300, 100)
        self.layer4 = nn.Linear(100, 50)
        self.layer5 = nn.Linear(50, 10)
        self.layer6 = nn.Linear(10, 1)
        self.dropout = dropout

    def forward(self, input_comment):
        output = self.input_layer(input_comment)
        output = self.encoder(output)
        output = output.reshape(output.size(0), -1)
        output = self.layer1(output)
        output = F.relu(output)
        output = F.dropout(output, p=self.dropout[0])
        output = self.layer2(output)
        output = F.relu(output)
        output = F.dropout(output, p=self.dropout[1])
        output = self.layer3(output)
        output = F.relu(output)
        output = F.dropout(output, p=self.dropout[2])
        output = self.layer4(output)
        output = F.relu(output)
        output = F.dropout(output, p=self.dropout[3])
        output = self.layer5(output)
        output = F.dropout(output, p=self.dropout[4])
        output = F.relu(output)
        output = self.layer6(output)
        return output

    def predict(self, input_comment):
        return self.forward(input_comment).detach()
