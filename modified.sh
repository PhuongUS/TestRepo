mkdir -p test
for item in $(git ls-files --modified)
do
        DIR=$(dirname $item)
        mkdir -p "test/$DIR"
        cp $item "test/$item"
done
