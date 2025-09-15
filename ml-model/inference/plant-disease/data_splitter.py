import os
import shutil
import random
from sklearn.model_selection import train_test_split

def create_train_val_split(source_dir, output_dir, train_ratio=0.8):
    """
    Create train/validation split from PlantVillage dataset structure
    
    Args:
        source_dir: Path to source dataset with all classes in individual folders
        output_dir: Output directory to create train/valid split
        train_ratio: Ratio of training data (default: 0.8)
    
    Returns:
        str: Path to the output directory
    """
    print(f"Creating train/val split from {source_dir}")
    
    train_dir = os.path.join(output_dir, 'train')
    val_dir = os.path.join(output_dir, 'valid')
    
    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir, exist_ok=True)
    
    class_folders = [f for f in os.listdir(source_dir) 
                    if os.path.isdir(os.path.join(source_dir, f)) and not f.startswith('.')]
    
    print(f"Found {len(class_folders)} disease classes")
    
    total_train_images = 0
    total_val_images = 0
    
    for class_name in class_folders:
        class_path = os.path.join(source_dir, class_name)
        
        os.makedirs(os.path.join(train_dir, class_name), exist_ok=True)
        os.makedirs(os.path.join(val_dir, class_name), exist_ok=True)
        
        images = [f for f in os.listdir(class_path) 
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        random.shuffle(images)
        split_idx = int(len(images) * train_ratio)
        train_images = images[:split_idx]
        val_images = images[split_idx:]
        
        # Copy training images
        for img in train_images:
            src = os.path.join(class_path, img)
            dst = os.path.join(train_dir, class_name, img)
            shutil.copy2(src, dst)
        
        # Copy validation images
        for img in val_images:
            src = os.path.join(class_path, img)
            dst = os.path.join(val_dir, class_name, img)
            shutil.copy2(src, dst)
        
        total_train_images += len(train_images)
        total_val_images += len(val_images)
        
        print(f"{class_name}: {len(train_images)} train, {len(val_images)} val")
    
    print(f"\nDataset split completed!")
    print(f"Total training images: {total_train_images}")
    print(f"Total validation images: {total_val_images}")
    print(f"Train/Val data saved to {output_dir}")
    
    return output_dir

def split_with_stratification(source_dir, output_dir, train_ratio=0.8):
    """
    Alternative splitting method using stratification to ensure balanced splits
    """
    print(f"Creating stratified train/val split from {source_dir}")
    
    train_dir = os.path.join(output_dir, 'train')
    val_dir = os.path.join(output_dir, 'valid')
    
    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir, exist_ok=True)
    
    class_folders = [f for f in os.listdir(source_dir) 
                    if os.path.isdir(os.path.join(source_dir, f)) and not f.startswith('.')]
    
    print(f"Found {len(class_folders)} disease classes")
    
    for class_name in class_folders:
        class_path = os.path.join(source_dir, class_name)
        
        os.makedirs(os.path.join(train_dir, class_name), exist_ok=True)
        os.makedirs(os.path.join(val_dir, class_name), exist_ok=True)
        
        images = [f for f in os.listdir(class_path) 
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        # Use sklearn's train_test_split for better stratification
        train_images, val_images = train_test_split(
            images, 
            train_size=train_ratio, 
            random_state=42,
            shuffle=True
        )
        
        # Copy training images
        for img in train_images:
            src = os.path.join(class_path, img)
            dst = os.path.join(train_dir, class_name, img)
            shutil.copy2(src, dst)
        
        # Copy validation images
        for img in val_images:
            src = os.path.join(class_path, img)
            dst = os.path.join(val_dir, class_name, img)
            shutil.copy2(src, dst)
        
        print(f"{class_name}: {len(train_images)} train, {len(val_images)} val")
    
    print(f"Stratified dataset split completed. Train/Val data saved to {output_dir}")
    return output_dir

if __name__ == "__main__":
    # Example usage (not executed since dataset is already split)
    source_data_dir = "PlantVillage-Raw"  # Hypothetical unsplit dataset
    output_data_dir = "PlantVillage-Split"
    
    print("This script is for reference only.")
    print("The PlantVillage dataset is already properly split into train/valid folders.")
    print("No splitting is required.")