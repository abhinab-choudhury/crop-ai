import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import transforms, datasets
import os
from pathlib import Path
import time

from model import get_model

def train_model(model_name, data_dir, epochs=5, batch_size=16):
    
    print(f"TRAINING {model_name.upper()}")
    print(f"Epochs: {epochs}")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")
    
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])
    
    train_dataset = datasets.ImageFolder(os.path.join(data_dir, 'train'), transform=transform)
    val_dataset = datasets.ImageFolder(os.path.join(data_dir, 'valid'), transform=transform)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=2)
    
    print(f"Training samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")
    print(f"Classes: {len(train_dataset.classes)}")
    
    model = get_model(model_name, num_classes=len(train_dataset.classes)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=5e-4, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=2)
    
    best_acc = 0.0
    start_time = time.time()
    
    for epoch in range(epochs):
        print(f"\n--- Epoch {epoch+1}/{epochs} ---")
        
        model.train()
        train_loss = 0.0
        train_correct = 0
        train_total = 0
        
        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)
            
            optimizer.zero_grad()
            output = model(data)
            loss = criterion(output, target)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
            _, predicted = torch.max(output.data, 1)
            train_total += target.size(0)
            train_correct += (predicted == target).sum().item()
            
            if batch_idx % 50 == 0:
                print(f"Batch {batch_idx}/{len(train_loader)}, Loss: {loss.item():.4f}")
        
        train_acc = 100. * train_correct / train_total
        
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for data, target in val_loader:
                data, target = data.to(device), target.to(device)
                output = model(data)
                loss = criterion(output, target)
                
                val_loss += loss.item()
                _, predicted = torch.max(output.data, 1)
                val_total += target.size(0)
                val_correct += (predicted == target).sum().item()
        
        val_acc = 100. * val_correct / val_total
        
        print(f"Train Acc: {train_acc:.2f}%, Val Acc: {val_acc:.2f}%")
        
        if val_acc > best_acc:
            best_acc = val_acc
            torch.save({
                'model_state_dict': model.state_dict(),
                'class_names': train_dataset.classes,
                'num_classes': len(train_dataset.classes),
                'model_name': model_name,
                'accuracy': val_acc
            }, f"models/{model_name}_best.pth")
            print(f"Saved best model: {val_acc:.2f}%")
        
        scheduler.step(val_acc)
    
    print(f"Training completed in {time.time() - start_time:.1f}s")
    print(f"Best accuracy: {best_acc:.2f}%")
    
    return model, train_dataset.classes

def export_to_onnx(model, model_name, class_names, output_path):
    """Export trained model to ONNX"""
    print(f"\nExporting {model_name} to ONNX...")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    model.eval()
    
    dummy_input = torch.randn(1, 3, 256, 256).to(device)
    
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    
    print(f"ONNX model saved: {output_path}")

def main():
    data_dir = "PlantVillage"  
    
    if not os.path.exists(data_dir):
        print(f"Error: Dataset not found at {data_dir}")
        print("Please make sure the PlantVillage dataset is available with train/valid folders")
        return
    
    train_path = os.path.join(data_dir, 'train')
    valid_path = os.path.join(data_dir, 'valid')
    
    if not os.path.exists(train_path) or not os.path.exists(valid_path):
        print(f"Error: Expected train and valid folders in {data_dir}")
        print(f"Current structure should be: PlantVillage/train/ and PlantVillage/valid/")
        return
    
    print(f"Using dataset at {data_dir}")
    print(f"Train folder: {train_path}")
    print(f"Valid folder: {valid_path}")
    
    os.makedirs("models", exist_ok=True)
    
    models_to_train = ['resnet18', 'resnet50']
    epochs = 10  
    batch_size = 32  
    
    for model_name in models_to_train:
        print(f"\n{'='*60}")
        print(f"TRAINING {model_name.upper()}")
        print(f"{'='*60}")
        
        model, class_names = train_model(
            model_name=model_name,
            data_dir=data_dir,
            epochs=epochs,
            batch_size=batch_size
        )
        
        onnx_path = f"models/{model_name}_plant_disease.onnx"
        export_to_onnx(model, model_name, class_names, onnx_path)
        
        print(f"{model_name} COMPLETED!")
    
    print(f"\nALL MODELS TRAINED AND EXPORTED!")
    print(f"Check the 'models/' folder for:")
    print(f"   - resnet9_best.pth & resnet9_plant_disease.onnx")
    print(f"   - resnet18_best.pth & resnet18_plant_disease.onnx")
    print(f"   - resnet50_best.pth & resnet50_plant_disease.onnx")

if __name__ == "__main__":
    main()